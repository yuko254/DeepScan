// removeChildrenByGlob.ts
import fg from 'fast-glob';
import { rm } from 'fs/promises';

export async function removeChildren(
  pattern: string,
  options?: {
    cwd?: string;
    dryRun?: boolean;
  }
) {
  const cwd = options?.cwd ?? process.cwd();
  const filesAndDirs = await fg(pattern, {
    cwd,
    dot: true,           // include dotfiles (e.g., .gitignore)
    onlyFiles: false,    // match directories as well
    absolute: true,      // return absolute paths so we can delete them safely
    followSymbolicLinks: false, // be cautious with symlinks
  });

  if (options?.dryRun) {
    console.log(`[dry-run] Would delete ${filesAndDirs.length} items:`);
    for (const f of filesAndDirs) {
      console.log(`  ${f}`);
    }
    return;
  }

  // Remove each matched item (files and directories recursively)
  for (const file of filesAndDirs) {
    await rm(file, { recursive: true, force: true });
  }
  console.log(`Deleted ${filesAndDirs.length} items matching "${pattern}" in ${cwd}`);
}

await removeChildren('prisma/generated/dart/*stores*');