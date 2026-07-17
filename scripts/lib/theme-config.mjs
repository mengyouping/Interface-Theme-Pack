import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export const THEMES = Object.freeze([
  { id: 'detective-noir', name: '侦探暗夜', englishName: 'Detective Noir' },
  { id: 'creed-of-shadows', name: '鹰羽信条', englishName: 'Creed of Shadows' },
  { id: 'spirit-bathhouse', name: '灵境汤屋', englishName: 'Spirit Bathhouse' },
  { id: 'red-alert-command', name: '红色警戒指挥部', englishName: 'Red Alert Command' },
  { id: 'stellar-dominion', name: '星海霸权', englishName: 'Stellar Dominion' }
]);

export const TARGETS = Object.freeze([
  { id: 'codex', label: 'Codex', root: 'Codex主题包', css: 'codex.css' },
  { id: 'workbuddy', label: 'WorkBuddy', root: 'WorkBuddy主题包', css: 'workbuddy.css' }
]);

export const sourceDir = (theme) => path.join(ROOT_DIR, 'shared-theme-sources', theme.id);
export const outputDir = (theme, target) => path.join(ROOT_DIR, target.root, theme.name);
export const outputKey = (theme, target) => `${theme.id}:${target.id}`;
export const packageName = (theme, target) => `${theme.id}-${target.id}.codedrobe-theme`;
