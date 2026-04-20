import { readdirSync, writeFileSync } from 'fs';

const daoDir = './src/DAO/DAOs';
const outputFile = './src/DAO/index.ts';

const files = readdirSync(daoDir)
  .filter(f => f.endsWith('.dao.ts') && !f.startsWith('base'));

const exports = files
  .map(file => {
    const name = file.replace('.dao.ts', '');
    return `export * from './DAOs/${name}.dao.js';`;
  })
  .join('\n');

const content = `// AUTO-GENERATED — do not edit manually\n// Run: npx tsx scripts/generate-dao-index.ts\n\n${exports}\n`;

writeFileSync(outputFile, content);
console.log(`Generated ${outputFile} with ${files.length} DAOs`);

const instancesContent = `// AUTO-GENERATED\nimport * as DAOs from './index.js';\n\n` +
  files.map(file => {
    const base = file.replace('.dao.ts', '');
    const className = base.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('') + 'Dao';
    const instanceName = base.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) + 'Dao';
    return `export const ${instanceName} = new DAOs.${className}();`;
  }).join('\n');

writeFileSync('./src/DAO/instances.ts', instancesContent);
console.log(`Generated ./src/DAO/instances.ts with ${files.length} singletonss`);