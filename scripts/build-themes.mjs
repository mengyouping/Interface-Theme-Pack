import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { THEMES, TARGETS, sourceDir, outputDir, packageName } from './lib/theme-config.mjs';

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const readJson = async (file) => JSON.parse(await fs.readFile(file, 'utf8'));
const writeJson = async (file, value) => fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');

function verificationFor(targetId) {
  return {
    required: [{ name: 'document-body', any: ['body'] }],
    recommended: [
      { name: 'main-surface', any: ['main', '[role="main"]', '.main-content', '.chat-container'] },
      { name: 'composer', any: ['[contenteditable="true"]', 'textarea', '[role="textbox"]'] }
    ],
    contexts: [{
      name: 'interactive-page',
      when: { any: ['body'] },
      recommended: [{ name: `${targetId}-navigation`, any: ['nav', 'aside', '[role="navigation"]'] }]
    }]
  };
}

function targetOptions(targetId, tokens) {
  if (targetId !== 'codex') return undefined;
  return {
    rendererProfile: 'codex-theme-v1',
    baseTheme: {
      mode: 'dark',
      accent: tokens.colors.accent,
      ink: tokens.colors.text,
      surface: tokens.colors.background
    }
  };
}

function packageBundle(source, target, themeId) {
  const options = targetOptions(target.id, source.tokens);
  return {
    format: 'codedrobe-theme',
    schemaVersion: 1,
    theme: {
      id: themeId,
      displayName: `${source.metadata.displayName} · ${target.label}`,
      version: source.metadata.version,
      copy: {
        tagline: source.metadata.tagline,
        originality: source.metadata.originality
      }
    },
    targets: {
      [target.id]: {
        css: source.css[target.id],
        ...(options ? { options } : {}),
        verification: verificationFor(target.id)
      }
    },
    assets: { images: { emblem: source.assets.emblemImage } }
  };
}

export async function buildAllThemes() {
  const summary = [];
  for (const theme of THEMES) {
    const source = await readJson(path.join(sourceDir(theme), 'theme-source.json'));
    for (const target of TARGETS) {
      const output = outputDir(theme, target);
      const themeId = `${theme.id}-${target.id}`;
      const packageFile = packageName(theme, target);
      await fs.rm(output, { recursive: true, force: true });
      await fs.mkdir(output, { recursive: true });
      const bundle = packageBundle(source, target, themeId);
      await writeJson(path.join(output, packageFile), bundle);
      summary.push({ themeId, target: target.id, output, packageFile });
    }
  }
  return summary;
}

if (isMain) {
  const summary = await buildAllThemes();
  console.log(`已生成 ${summary.length} 套单目标 CodeDrobe 主题包。`);
  for (const item of summary) console.log(`- ${item.themeId}: ${path.relative(process.cwd(), path.join(item.output, item.packageFile))}`);
}
