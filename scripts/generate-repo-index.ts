import { readdirSync, writeFileSync } from 'fs';

const repoDir = './src/Repository/Repos';
const outputFile = './src/Repository/index.ts';

const files = readdirSync(repoDir)
  .filter(f => f.endsWith('.repo.ts') && !f.startsWith('base'));

const exports = files
  .map(file => {
    const name = file.replace('.repo.ts', '');
    return `export * from './Repos/${name}.repo.js';`;
  })
  .join('\n');

const content = `// AUTO-GENERATED — do not edit manually\n// Run: npx tsx scripts/generate-repo-index.ts\n\n${exports}\n`;

writeFileSync(outputFile, content);
console.log(`Generated ${outputFile} with ${files.length} Repos`);

const instancesContent = `// AUTO-GENERATED\nimport * as Repos from './index.js';\n\n` +
  files.map(file => {
    const base = file.replace('.repo.ts', '');
    if (base === "BaseRepository") return;
    const className = base.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
    const instanceName = base.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    return `export const ${instanceName} = new Repos.${className}();`;
  }).join('\n');

writeFileSync('./src/Repository/instances.ts', instancesContent);
console.log(`Generated ./src/Repository/instances.ts with ${files.length} singletonss`);