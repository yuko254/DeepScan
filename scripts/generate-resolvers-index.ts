import { readdirSync, writeFileSync } from 'fs';
import path from 'path';

const resolversDir = path.join(process.cwd(), 'src/graphql/resolvers');
const outputFile = path.join(resolversDir, 'index.ts');

const resolverFiles = readdirSync(resolversDir)
  .filter(file => file.endsWith('.resolver.ts') && file !== 'index.ts')
  .map(file => ({
    importName: file.replace('.resolver.ts', 'Resolver'),
    filePath: `./${file.replace('.ts', '.js')}`,
  }));

const imports = resolverFiles.map(f => 
  `import { ${f.importName} } from '${f.filePath}';`
).join('\n');

const queries = resolverFiles.map(f => `  ...${f.importName}.Query,`).join('\n');
const mutations = resolverFiles.map(f => `  ...${f.importName}.Mutation,`).join('\n');

// Spread ALL properties except Query and Mutation
const typeResolvers = resolverFiles.flatMap(f => 
  [`  ...${f.importName},`]
).join('\n');

const content = `// AUTO-GENERATED - DO NOT EDIT
// Run 'npm run generate:resolvers' to update

${imports}

export const resolvers = {
${typeResolvers}
  Query: {
${queries}
  },
  Mutation: {
${mutations}
  }
};
`;

writeFileSync(outputFile, content);