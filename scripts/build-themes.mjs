import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { THEMES, TARGETS, sourceDir, outputDir, packageName } from './lib/theme-config.mjs';

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const readJson = async (file) => JSON.parse(await fs.readFile(file, 'utf8'));
const writeJson = async (file, value) => fs.writeFile(file, `${JSON.stringify(value)}\n`, 'utf8');

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

function compactTargetCss(source, targetId) {
  const c = source.tokens.colors;
  const host = `html.codedrobe-host-${targetId}`;
  const platform = targetId === 'codex'
    ? `${host} [data-testid="composer"],${host} [contenteditable="true"],${host} textarea{box-shadow:0 0 0 1px ${c.border},0 18px 48px rgba(0,0,0,.28)}${host} pre{border-left:3px solid ${c.accent}}`
    : `${host} [contenteditable="true"],${host} textarea{box-shadow:0 0 0 1px ${c.border},0 16px 44px rgba(0,0,0,.26)}${host} aside{border-right:1px solid ${c.border}}`;
  return `/* ${source.metadata.displayName} / ${targetId} / 原创致敬主题 */
${host}{--t-bg:${c.background};--t-s:${c.surface};--t-text:${c.text};--t-muted:${c.muted};--t-a:${c.accent};--t-a2:${c.accent2};--t-b:${c.border};color-scheme:dark}
${host} body{color:var(--t-text);background:radial-gradient(circle at 82% 12%,color-mix(in srgb,var(--t-a2) 18%,transparent),transparent 38%),linear-gradient(135deg,var(--t-bg),var(--t-s)) fixed}
${host} body::before{content:"";position:fixed;inset:0;z-index:-1;pointer-events:none;background:repeating-linear-gradient(90deg,transparent 0 47px,color-mix(in srgb,var(--t-b) 18%,transparent) 48px),repeating-linear-gradient(0deg,transparent 0 47px,color-mix(in srgb,var(--t-b) 18%,transparent) 48px);opacity:.55}
${host} main,${host} [role="main"]{background:color-mix(in srgb,var(--t-bg) 78%,transparent);backdrop-filter:blur(14px)}${host} aside,${host} nav{background:color-mix(in srgb,var(--t-s) 88%,transparent);backdrop-filter:blur(18px)}
${host} button,${host} input,${host} textarea,${host} [contenteditable="true"],${host} [role="textbox"]{color:var(--t-text);border-color:var(--t-b);background:color-mix(in srgb,var(--t-s) 91%,transparent)}
${host} button:hover,${host} [aria-selected="true"],${host} [data-state="active"]{border-color:var(--t-a2);background:color-mix(in srgb,var(--t-a) 18%,var(--t-s))}${host} :focus-visible{outline:2px solid var(--t-a2);outline-offset:2px}
${host} a{color:var(--t-a2)}${host} pre,${host} code{background:${c.code};color:var(--t-text);border-color:var(--t-b)}${host} blockquote{border-left-color:var(--t-a);color:var(--t-muted)}${host} .codedrobe-theme-emblem{pointer-events:none;background:var(--codedrobe-image-emblem) center/contain no-repeat}
${platform}
@media (prefers-reduced-motion:reduce){${host} *,${host} *::before,${host} *::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
`;
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
        css: compactTargetCss(source, target.id),
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
