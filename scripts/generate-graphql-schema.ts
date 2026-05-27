import pluralize from 'pluralize';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

// ── Annotation configuration (edit this to add/remove annotations) ──
const ANNOTATION_CONFIG: Record<string, string> = {
  '@Include': 'include',
  '@IncludeOnCreate': 'includeOnCreate',
  '@IncludeOnUpdate': 'includeOnUpdate',
  '@Exclude': 'exclude',
  '@ExcludeOnType': 'excludeOnType',
  '@ExcludeOnCreate': 'excludeOnCreate',
  '@ExcludeOnUpdate': 'excludeOnUpdate',
  '@Required': 'required',
  '@RequiredOnCreate': 'requiredOnCreate',
  '@RequiredOnUpdate': 'requiredOnUpdate',
  '@nested': 'allowNesting',
  '@nestedOnly': 'nestedOnly',
  '@sensitive': 'isSensitive',
  '@system': 'isSystem',
  '@reference': 'isReference',
};

// ── Types ─────────────────────────────────────────────
type Relation = {
  FKs: string[];
  onDelete: string | null | undefined;
  onUpdate: string | null | undefined;
};

type Field = {
  name: string;
  type: string;
  isList: boolean;
  isPk: boolean;
  isSetNullFK: boolean;
  required: boolean;
  requiredOnCreate: boolean;
  requiredOnUpdate: boolean;
  isRelation: boolean;
  Relation: Relation | null;
  hasDefault: boolean;
  isSensitive: boolean;
  isSystem: boolean;
  allowNesting: boolean;
  showInCreate: boolean;
  showInUpdate: boolean;
  showInType: boolean;
  include: boolean;
  includeOnCreate: boolean;
  includeOnUpdate: boolean;
  exclude: boolean;
  excludeOnCreate: boolean;
  excludeOnUpdate: boolean;
  excludeOnType: boolean;
};

type Model = {
  name: string;
  fields: Field[];
  Fks: Set<string>;
  nestedFks: Set<string>;
  forwardRelations: Field[];
  isSystem: boolean;
  isReference: boolean;
  nestedOnly: boolean;
  showInCreate: boolean;
  showInUpdate: boolean;
  showInType: boolean;
  hasCreateInput: boolean;
  hasUpdateInput: boolean;
};

type ModelSchema = {
  typeDef: string;
  createInput: string;
  updateInput: string;
  queryFields: string;
  mutationFields: string;
};

// ── Helpers ───────────────────────────────────────────
function mapScalar(type: string): string {
  const map: Record<string, string> = {
    String: 'String', Int: 'Int', Float: 'Float', Boolean: 'Boolean',
    BigInt: 'BigInt', DateTime: 'DateTime', Json: 'JSON', Decimal: 'Float',
    Bytes: 'String',
  };
  return map[type] ?? type;
}

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function setNullComment(field: Field, inputType: 'create' | 'update'): string {
  if (!field.isSetNullFK) return '';
  if (inputType === 'create' && field.requiredOnCreate) return '';
  if (inputType === 'update' && field.requiredOnUpdate) return '';
  const annotation = inputType === 'create' ? '@RequiredOnCreate' : '@RequiredOnUpdate';
  return ` # FK (SetNull) – optional in DB, can be required via ${annotation}`;
}

function getReferenceModelNames(models: Model[]): Set<string> {
  return new Set(
    models
      .filter(m => m.isReference)
      .map(m => m.name)
  );
}

function getPrecedingAnnotation(raw: string, matchStart: number, annotation: string): boolean {
  const before = raw.substring(0, matchStart).trimEnd();
  const lines = before.split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i]!.trim();
    if (line.length === 0) continue;
    if (line.startsWith('//')) {
      const content = line.slice(2).trim();
      const escaped = annotation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').toLowerCase();
      const regex = new RegExp(`(?:^|\\s)${escaped}(?:\\s|$)`);
      return regex.test(content.toLowerCase());
    }
    break;
  }
  return false;
}

function extractKeyConstraints(rawSchema: string, modelName: string): Set<string> {
  const modelRegex = new RegExp(`model\\s+${modelName}\\s*\\{([^}]+)\\}`, 'g');
  const modelBody = modelRegex.exec(rawSchema)?.[1] ?? '';
  const lines = modelBody
    .split('\n')
    .map(l => l.trim())
    .filter(l =>
      l.startsWith('@@id') ||
      l.startsWith('@@unique') ||
      (l.includes('@unique') && !l.startsWith('@@'))
    );

  const fields = new Set<string>();
  for (const line of lines) {
    const multiMatch = line.match(/\[([^\]]+)\]/);
    if (multiMatch) {
      multiMatch[1]!.split(',').forEach(f => fields.add(f.trim().replace(/\s+/g, '')));
    } else {
      const fieldMatch = line.match(/^(\w+)\s/);
      if (fieldMatch) fields.add(fieldMatch[1]!);
    }
  }
  return fields;
}

// ── Schema parsing ────────────────────────────────────
function parseModels(raw: string): Model[] {
  const modelNames = new Set<string>();
  const modelNameRegex = /model\s+(\w+)\s*\{/g;
  let m;
  while ((m = modelNameRegex.exec(raw)) !== null) modelNames.add(m[1]!);

  const models: Model[] = [];
  const modelRegex = /model\s+(\w+)\s*\{([^}]+)\}/g;
  let modelMatch;

  while ((modelMatch = modelRegex.exec(raw)) !== null) {
    const name = modelMatch[1]!;
    const body = modelMatch[2]!;
    const lines = body
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0 && !l.startsWith('//') && !l.startsWith('@@') && !l.startsWith('///'));

    const modelExcludeOnUpdate = getPrecedingAnnotation(raw, modelMatch.index, '@ExcludeOnUpdate');
    const modelExcludeOnCreate = getPrecedingAnnotation(raw, modelMatch.index, '@ExcludeOnCreate');
    let modelExcludeOnType = getPrecedingAnnotation(raw, modelMatch.index, '@ExcludeOnType');
    let modelExclude = getPrecedingAnnotation(raw, modelMatch.index, '@Exclude');
    const modelNestedOnly = getPrecedingAnnotation(raw, modelMatch.index, '@nestedOnly');
    let modelIsSystem = getPrecedingAnnotation(raw, modelMatch.index, '@system');
    const modelIsReference = getPrecedingAnnotation(raw, modelMatch.index, '@reference');

    const fields: Field[] = [];

    for (const line of lines) {
      const fieldMatch = line.match(/^(\w+)\s+(\w+(?:\[\])?)(\?)?\s*(.*)$/);
      if (!fieldMatch) continue;

      const fieldName = fieldMatch[1]!;
      let fieldType = fieldMatch[2]!;
      const optional = fieldMatch[3] === '?';
      const isList = fieldType.endsWith('[]');
      if (isList) fieldType = fieldType.slice(0, -2);
      const attributes = fieldMatch[4] || '';

      const isRelation = modelNames.has(fieldType);
      const isPk = attributes.includes('@id');
      const isDbGenerated =
        attributes.includes('autoincrement()') ||
        attributes.includes('now()') ||
        attributes.includes('dbgenerated') ||
        attributes.includes('@updatedAt');
      const hasDefault = attributes.includes('@default(');
      const isIgnored = attributes.includes('@ignore');

      // Parse annotations dynamically from config
      const a: Record<string, boolean> = {};
      for (const [annotation, prop] of Object.entries(ANNOTATION_CONFIG)) {
        const escaped = annotation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').toLowerCase();
        const regex = new RegExp(`//.*${escaped}\\b`);
        a[prop] = regex.test(attributes.toLowerCase());
      }

      let Relation: Relation | null = null;
      if (isRelation) {
        const relMatch = attributes.match(/@relation\([^)]*fields:\s*\[([^\]]+)\]/);
        const relationFields = relMatch ? relMatch[1]!.split(',').map(f => f.trim()) : null;
        const onDeleteMatch = attributes.match(/onDelete:\s*(\w+)/);
        const onDelete = onDeleteMatch ? onDeleteMatch[1] ?? null : null;
        const onUpdateMatch = attributes.match(/onUpdate:\s*(\w+)/);
        const onUpdate = onUpdateMatch ? onUpdateMatch[1] ?? null : null;
        if (relationFields || onDelete || onUpdate) {
          Relation = { FKs: relationFields ?? [], onDelete, onUpdate };
        }
      }

      fields.push({
        name: fieldName,
        type: fieldType,
        isList,
        isPk,
        isSetNullFK: false,
        required: !optional || (a.required ?? false),
        requiredOnCreate: a.requiredOnCreate ?? false,
        requiredOnUpdate: a.requiredOnUpdate ?? false,
        isRelation,
        Relation,
        hasDefault,
        isSensitive: a.isSensitive ?? false,
        isSystem: (a.isSystem ?? false) || isDbGenerated || isIgnored,
        allowNesting: a.allowNesting ?? false,
        showInCreate: false,
        showInUpdate: false,
        showInType: false,
        include: a.include ?? false,
        includeOnCreate: a.includeOnCreate ?? false,
        includeOnUpdate: a.includeOnUpdate ?? false,
        exclude: a.exclude ?? false,
        excludeOnCreate: a.excludeOnCreate ?? false,
        excludeOnUpdate: a.excludeOnUpdate ?? false,
        excludeOnType: a.excludeOnType ?? false
      });
    }

    // Mark scalar FKs that belong to a SetNull relation
    for (const field of fields) {
      if (field.isRelation && field.Relation?.FKs && field.Relation.onDelete === 'SetNull') {
        for (const fk of field.Relation.FKs) {
          const scalar = fields.find(f => f.name === fk && !f.isRelation);
          if (scalar) scalar.isSetNullFK = true;
        }
      }
    }

    const allFks = new Set(
      fields.filter(f => f.isRelation && f.Relation?.FKs).flatMap(f => f.Relation!.FKs)
    );

    models.push({
      name,
      fields,
      Fks: new Set(allFks),
      nestedFks: new Set(allFks),
      forwardRelations: fields.filter(f => f.isRelation && f.Relation?.FKs?.length),
      nestedOnly: modelNestedOnly,
      isSystem: modelIsSystem,
      isReference: modelIsReference,
      showInCreate: !modelExcludeOnCreate && !modelIsSystem && !modelExclude,
      showInUpdate: !modelExcludeOnUpdate && !modelIsSystem && !modelExclude,
      showInType: !modelExcludeOnType && !modelExclude,
      hasCreateInput: false,
      hasUpdateInput: false,
    });
  }

  return models;
}

function parseEnums(raw: string) {
  const enums: { name: string; values: string[] }[] = [];
  const enumRegex = /enum\s+(\w+)\s*\{([^}]+)\}/g;
  let m;
  while ((m = enumRegex.exec(raw)) !== null) {
    const name = m[1]!;
    const body = m[2]!;
    const values = body
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0 && !l.startsWith('//'))
      .map(l => l.split(/\s+/)[0]!);
    enums.push({ name, values });
  }
  return enums;
}

// ── Computation ──────────────────────────────────────
function computeFks(models: Model[], referenceNames: Set<string>) {
  for (const model of models) {
    // All non‑reference model FKs
    model.Fks = new Set(
      model.fields
        .filter(f => f.isRelation && f.Relation?.FKs)
        .filter(f => !referenceNames.has(f.type))
        .flatMap(f => f.Relation!.FKs)
    );

    // FKs covered by nested forward relations (@nested)
    model.nestedFks = new Set(
      model.fields
        .filter(f => f.isRelation && f.allowNesting && f.Relation?.FKs && !referenceNames.has(f.type))
        .flatMap(f => f.Relation!.FKs)
    );
  }
}

function computeFieldVisibility(models: Model[]) {
  for (const model of models) {
    for (const field of model.fields) {
      let baseCreate = !field.isRelation && !field.isPk && !field.isSystem && !model.nestedFks.has(field.name);
      let baseUpdate = field.isPk || !field.isRelation && !field.isSystem && !model.Fks.has(field.name);
      let baseType = !field.isSensitive;

      if (!field.isRelation && model.Fks.has(field.name)) {
        baseType = false;
      }
      if (!field.isRelation && model.nestedFks.has(field.name)) {
        baseCreate = false;
      }

      let showCreate = baseCreate;
      let showUpdate = baseUpdate;
      let showType = baseType;

      if (field.include) {
        showCreate = showUpdate = showType = true;
      }
      if (field.includeOnCreate) showCreate = true;
      if (field.includeOnUpdate) showUpdate = true;

      if (field.exclude) {
        showCreate = showUpdate = showType = false;
      }
      if (field.excludeOnCreate) showCreate = false;
      if (field.excludeOnUpdate) showUpdate = false;
      if (field.excludeOnType) showType = false;

      if (field.isRelation) {
        const targetModel = models.find(m => m.name === field.type);
        if (targetModel) {
          if (!targetModel.showInType) showType = false;
          if (!targetModel.showInCreate) showCreate = false;
          if (!targetModel.showInUpdate) showUpdate = false;
        }
      }

      if (field.isPk) {
        showUpdate = true;
        field.requiredOnUpdate = true;
      }

      field.showInCreate = showCreate;
      field.showInUpdate = showUpdate;
      field.showInType = showType;
    }
  }
}

function buildComposableChildren(models: Model[]): Map<string, { childModel: Model; childRel: Field; parentField: Field }[]> {
  const map = new Map<string, { childModel: Model; childRel: Field; parentField: Field }[]>();

  for (const parent of models) {
    const children: { childModel: Model; childRel: Field; parentField: Field }[] = [];

    for (const child of models) {
      if (child.name === parent.name) continue;

      const childRel = child.fields.find(
        f => f.isRelation && f.type === parent.name && f.Relation?.FKs?.length
      );
      if (!childRel) continue;

      const parentField = parent.fields.find(
        f => f.isRelation && f.type === child.name
      );
      if (!parentField) continue;

      if (!parentField.allowNesting) continue;

      children.push({ childModel: child, childRel, parentField });
    }

    if (children.length > 0) map.set(parent.name, children);
  }

  return map;
}

function precomputeInputFlags(models: Model[], composable: Map<string, { childModel: Model; childRel: Field; parentField: Field }[]>) {
  for (const model of models) {
    if (model.isSystem) continue;

    // Create input
    if (!model.showInCreate) {
      model.hasCreateInput = false;
    } else {
      let createScalarCount = model.fields.filter(f => f.showInCreate).length;
      let createNestedCount = 0;
      const children = composable.get(model.name);
      if (children) {
        for (const { childModel: child, parentField } of children) {
          if (child.showInCreate && !(parentField.excludeOnCreate || parentField.exclude)) {
            createNestedCount++;
          }
        }
      }
      let createForwardCount = 0;
      for (const rel of model.forwardRelations) {
        if (!rel.allowNesting) continue;
        const related = models.find(m => m.name === rel.type);
        if (related && related.showInCreate) createForwardCount++;
      }
      model.hasCreateInput = (createScalarCount + createNestedCount + createForwardCount) > 0;
    }

    // Update input
    if (!model.showInUpdate) {
      model.hasUpdateInput = false;
    } else {
      let updateScalarCount = model.fields.filter(f => f.showInUpdate).length;
      let updateNestedCount = 0;
      const children = composable.get(model.name);
      if (children) {
        for (const { childModel: child, parentField } of children) {
          if (child.showInUpdate && !(parentField.excludeOnUpdate || parentField.exclude)) {
            updateNestedCount++;
          }
        }
      }
      let updateForwardCount = 0;
      for (const rel of model.forwardRelations) {
        if (!rel.allowNesting) continue;
        const related = models.find(m => m.name === rel.type);
        if (related && related.showInUpdate) updateForwardCount++;
      }
      model.hasUpdateInput = (updateScalarCount + updateNestedCount + updateForwardCount) > 1;
    }
  }
}

// ── SDL generation ────────────────────────────────────
function generateEnumSchema(enums: { name: string; values: string[] }[]): string {
  let s = '';
  for (const e of enums) {
    s += `enum ${e.name} {\n`;
    e.values.forEach(v => s += `  ${v}\n`);
    s += `}\n\n`;
  }
  return s;
}

function generateModelSchema(
  model: Model,
  models: Model[],
  composable: Map<string, { childModel: Model; childRel: Field; parentField: Field }[]>
): ModelSchema {
  const result: ModelSchema = {
    typeDef: '',
    createInput: '',
    updateInput: '',
    queryFields: '',
    mutationFields: '',
  };

  // ── Type definition ────────────────────────────────
  if (model.showInType) {
    let typeStr = `type ${model.name} {\n`;
    // Iterate over ALL fields, not just visible ones, so we can comment on hidden relations
    for (const field of model.fields) {
      if (field.isRelation) {
        const targetModel = models.find(m => m.name === field.type);
        const targetHidden = !targetModel || !targetModel.showInType;

        if (targetHidden) {
          // Comment out the field and explain why
          const reason = targetModel
            ? (targetModel.isSystem ? '@system' : '@Exclude / @ExcludeOnType')
            : 'model not found';
          const fieldType = field.isList
            ? `[${field.type}]!`
            : `${field.required ? field.type + '!' : field.type}`;
          typeStr += `  # ${field.name}: ${fieldType}  // this model has a ${reason}\n`;
          continue;   // skip actual field output
        }
      }
      if (!field.showInType) continue;

      // Normal field output (identical to before)
      if (field.isRelation) {
        typeStr += field.isList
          ? `  ${field.name}: [${field.type}]!\n`
          : `  ${field.name}: ${field.required ? `${field.type}!` : field.type}\n`;
      } else {
        typeStr += `  ${field.name}: ${mapScalar(field.type)}${field.required ? '!' : ''}\n`;
      }
    }
    typeStr += `}\n\n`;
    result.typeDef = typeStr;

    // ── Query fields for this model ────────────────────
    let plural = toCamelCase(pluralize(model.name));
    const singular = toCamelCase(pluralize.singular(model.name));
    if (plural === singular) plural += 'List';
    result.queryFields = `  ${plural}: [${model.name}!]!\n  ${singular}(id: ID!): ${model.name}\n`;
  }

  // ── Create input ────────────────────────────────────
  if (model.hasCreateInput) {
    const createFields = model.fields.filter(f => f.showInCreate);
    const children = composable.get(model.name);
    const nestedChildren: string[] = [];
    if (children) {
      for (const { childModel: child, parentField } of children) {
        const skipDueToChild = !child.hasCreateInput;
        const skipDueToParent = parentField.excludeOnCreate || parentField.exclude || parentField.isSystem;
        if (skipDueToChild || skipDueToParent) {
          if (parentField.allowNesting) {
            let reason = '';
            if (skipDueToChild) {
              if (!child.showInCreate) {
                reason = child.isSystem ? '@system' : '@ExcludeOnCreate';
              } else {
                reason = 'no updatable fields (all system/FK)';
              }
            } else {
              reason = parentField.isSystem ? 'parent field @system' : 'parent @ExcludeOnCreate';
            }
            const fieldName = parentField.isList
              ? `${toCamelCase(pluralize(child.name))}: [${child.name}CreateInput!]`
              : `${parentField.name}: ${child.name}CreateInput`;
            nestedChildren.push(`  # ${fieldName} this model has ${reason}`);
          }
          continue;
        }
        if (parentField.isList) {
          const pluralName = toCamelCase(pluralize(child.name));
          nestedChildren.push(`  ${pluralName}: [${child.name}CreateInput!]`);
        } else {
          nestedChildren.push(`  ${parentField.name}: ${child.name}CreateInput`);
        }
      }
    }
    const forwardNested: string[] = [];
    for (const rel of model.forwardRelations) {
      if (!rel.allowNesting) continue;
      const related = models.find(m => m.name === rel.type);
      if (related && related.hasCreateInput) {
        forwardNested.push(`  ${rel.name}: ${related.name}CreateInput`);
      } else if (rel.allowNesting) {
        let reason = 'missing';
        if (related) {
          if (!related.showInCreate) {
            reason = related.isSystem ? '@system' : '@ExcludeOnCreate';
          } else {
            reason = 'no fields in CreateInput (all system/FK)';
          }
        }
        forwardNested.push(`  # ${rel.name}: ${related?.name ?? '?'}CreateInput this model has (${reason})`);
      }
    }
    if (createFields.length + nestedChildren.length + forwardNested.length > 0) {
      let inp = `input ${model.name}CreateInput {\n`;
      for (const f of createFields) {
        const req = f.required || f.requiredOnCreate;
        const comment = setNullComment(f, 'create');
        inp += `  ${f.name}: ${mapScalar(f.type)}${req ? '!' : ''}${comment}\n`;
      }
      for (const line of nestedChildren) inp += line + '\n';
      for (const line of forwardNested) inp += line + '\n';
      inp += `}\n\n`;
      result.createInput = inp;
    }
  }

  // ── Update input ────────────────────────────────────
  if (model.hasUpdateInput) {
    const updateFields = model.fields.filter(f => f.showInUpdate);
    const children = composable.get(model.name);
    const nestedChildrenUpdate: string[] = [];
    if (children) {
      for (const { childModel: child, parentField } of children) {
        const skipDueToChild = !child.hasUpdateInput;
        const skipDueToParent = parentField.excludeOnUpdate || parentField.exclude || parentField.isSystem;
        if (skipDueToChild || skipDueToParent) {
          if (parentField.allowNesting) {
            let reason = '';
            if (skipDueToChild) {
              if (!child.showInUpdate) {
                reason = child.isSystem ? '@system' : '@ExcludeOnUpdate';
              } else {
                reason = 'no updatable fields (all system/FK)';
              }
            } else {
              reason = parentField.isSystem ? 'parent field @system' : 'parent @ExcludeOnUpdate';
            }
            const fieldName = parentField.isList
              ? `${toCamelCase(pluralize(child.name))}: [${child.name}UpdateInput!]`
              : `${parentField.name}: ${child.name}UpdateInput`;
            nestedChildrenUpdate.push(`  # ${fieldName} this model has ${reason}`);
          }
          continue;
        }
        if (parentField.isList) {
          const pluralName = toCamelCase(pluralize(child.name));
          nestedChildrenUpdate.push(`  ${pluralName}: [${child.name}UpdateInput!]`);
        } else {
          nestedChildrenUpdate.push(`  ${parentField.name}: ${child.name}UpdateInput`);
        }
      }
    }
    const forwardNestedUpdate: string[] = [];
    for (const rel of model.forwardRelations) {
      if (!rel.allowNesting) continue;
      const related = models.find(m => m.name === rel.type);
      if (related && related.hasUpdateInput) {
        forwardNestedUpdate.push(`  ${rel.name}: ${related.name}UpdateInput`);
      } else if (rel.allowNesting) {
        let reason = 'missing';
        if (related) {
          if (!related.showInUpdate) {
            reason = related.isSystem ? '@system' : '@ExcludeOnUpdate';
          } else {
            reason = 'no fields in UpdateInput (all system/FK)';
          }
        }
        forwardNestedUpdate.push(`  # ${rel.name}: ${related?.name ?? '?'}UpdateInput this model has (${reason})`);
      }
    }
    if (updateFields.length + forwardNestedUpdate.length + nestedChildrenUpdate.length > 1) {
      let inp = `input ${model.name}UpdateInput {\n`;
      for (const f of updateFields) {
        const req = f.requiredOnUpdate;
        const comment = setNullComment(f, 'update');
        inp += `  ${f.name}: ${mapScalar(f.type)}${req ? '!' : ''}${comment}\n`;
      }
      for (const line of forwardNestedUpdate) inp += line + '\n';
      for (const line of nestedChildrenUpdate) inp += line + '\n';
      inp += `}\n\n`;
      result.updateInput = inp;
    }
  }

  // ── Mutation fields for this model ──────────────────
  if (!model.isSystem && model.showInType) {
    const singular = capitalize(toCamelCase(pluralize.singular(model.name)));
    let mut = '';
    if (!model.nestedOnly && model.hasCreateInput)
      mut += `  create${singular}(data: ${model.name}CreateInput!): ${model.name}!\n`;
    if (!model.nestedOnly && model.hasUpdateInput)
      mut += `  update${singular}(id: ID!, data: ${model.name}UpdateInput!): ${model.name}!\n`;
    mut += `  delete${singular}(id: ID!): ${model.name}!\n`;
    result.mutationFields = mut;
  }

  return result;
}

function generateSDL(
  models: Model[],
  composable: Map<string, { childModel: Model; childRel: Field; parentField: Field }[]>,
  enums: { name: string; values: string[] }[]
): string {
  let schema = `# Auto-generated GraphQL schema from Prisma\n\nscalar DateTime\nscalar JSON\nscalar BigInt\n\n`;

  // Enums – loop and add each
  schema += generateEnumSchema(enums);

  const queryFields: string[] = [];
  const mutationFields: string[] = [];

  for (const model of models) {
    if (model.isSystem && !model.showInType) continue; // skip completely hidden models

    const ms = generateModelSchema(model, models, composable);
    schema += ms.typeDef + ms.createInput + ms.updateInput;

    if (ms.queryFields) queryFields.push(ms.queryFields);
    if (ms.mutationFields) mutationFields.push(ms.mutationFields);
  }

  // Single Query type
  schema += `type Query {\n`;
  for (const q of queryFields) schema += q;
  schema += `}\n\n`;

  // Single Mutation type
  schema += `type Mutation {\n`;
  for (const m of mutationFields) schema += m;
  schema += `}\n`;

  return schema;
}

// ── Main ──────────────────────────────────────────────
const rawSchema = readFileSync('prisma/schema.prisma', 'utf-8');
const models = parseModels(rawSchema);
const enums = parseEnums(rawSchema);
const referenceNames = getReferenceModelNames(models);
computeFks(models, referenceNames);
computeFieldVisibility(models);
const composableChildren = buildComposableChildren(models);
precomputeInputFlags(models, composableChildren);
const graphqlSDL = generateSDL(models, composableChildren, enums);

// const outputDir = 'src/graphql';
const outputDir = 'src/graphql/generated';
mkdirSync(outputDir, { recursive: true });
writeFileSync(`${outputDir}/schema.graphql`, graphqlSDL);
console.log(`✅ GraphQL schema generated: ${outputDir}/schema.graphql`);