/**
 * Tailwind class-conflict resolver — zero dependencies.
 *
 * It groups each class by the CSS property it controls (respecting variant
 * modifiers such as `hover:` / `md:` and arbitrary `[...]` values) and keeps
 * only the last class per group, so later classes win. This covers the common
 * utilities (spacing, sizing, color, border, ring, typography, layout); it is
 * intentionally smaller than `tailwind-merge` and resolves unknown utilities by
 * their first segment.
 *
 * @example
 * twMerge('px-2 px-4')                  // 'px-4'
 * twMerge('text-sm text-red-500')       // 'text-sm text-red-500' (size ≠ color)
 * twMerge('ring-2 ring-4 ring-ring')    // 'ring-4 ring-ring'     (width ≠ color)
 */

const DISPLAY = new Set([
  'flex',
  'inline-flex',
  'block',
  'inline-block',
  'inline',
  'grid',
  'inline-grid',
  'table',
  'contents',
  'flow-root',
  'hidden',
]);

const FONT_WEIGHTS = new Set([
  'thin',
  'extralight',
  'light',
  'normal',
  'medium',
  'semibold',
  'bold',
  'extrabold',
  'black',
]);

const TEXT_SIZES = new Set([
  'xs',
  'sm',
  'base',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  '7xl',
  '8xl',
  '9xl',
]);

const BORDER_SIDES = new Set(['x', 'y', 't', 'r', 'b', 'l', 's', 'e']);

/** A scale-like value (number, fraction, `px`, or arbitrary `[...]`). */
const isScale = (v: string): boolean =>
  v === 'px' ||
  /^\d+(\.\d+)?$/.test(v) ||
  /^\d+\/\d+$/.test(v) ||
  (v.startsWith('[') && v.endsWith(']'));

/**
 * Split a token into its `modifier:` prefix and bare utility, honoring colons
 * that appear inside arbitrary `[...]` values (which must not be split on).
 */
function splitModifier(token: string): [string, string] {
  let depth = 0;
  let cut = -1;

  for (let i = 0; i < token.length; i++) {
    const c = token[i];
    if (c === '[') depth++;
    else if (c === ']') depth--;
    else if (c === ':' && depth === 0) cut = i;
  }

  return cut === -1
    ? ['', token]
    : [token.slice(0, cut + 1), token.slice(cut + 1)];
}

/** The conflict group for a bare utility (no modifier, no `!`). */
function group(util: string): string {
  const u = util.startsWith('-') ? util.slice(1) : util;
  if (DISPLAY.has(u)) return 'display';

  const seg = u.split('-');
  const head = seg[0] ?? u;
  const s1 = seg[1] ?? '';
  const s2 = seg[2] ?? '';

  if (head === 'text' && seg.length > 1)
    return TEXT_SIZES.has(s1) || isScale(s1) ? 'font-size' : 'text-color';

  if (head === 'font' && seg.length > 1)
    return FONT_WEIGHTS.has(s1) ? 'font-weight' : 'font-family';

  if (head === 'ring' && s1 === 'offset')
    return s2 === '' || isScale(s2) ? 'ring-offset-width' : 'ring-offset-color';

  if (head === 'ring')
    return s1 === '' || isScale(s1) ? 'ring-width' : 'ring-color';

  if (head === 'border') {
    const sided = BORDER_SIDES.has(s1);
    const side = sided ? `-${s1}` : '';
    const value = sided ? s2 : s1;
    const kind = value === '' || isScale(value) ? 'width' : 'color';
    return `border${side}-${kind}`;
  }

  if (head === 'gap' && (s1 === 'x' || s1 === 'y')) return `gap-${s1}`;
  if ((head === 'min' || head === 'max') && s1 !== '') return `${head}-${s1}`;

  return head;
}

/**
 * Merge Tailwind class strings, resolving conflicts so later classes win.
 * Non-conflicting classes are preserved; duplicates are removed.
 */
export function twMerge(...inputs: readonly string[]): string {
  const seen = new Map<string, number>();
  const out: string[] = [];

  for (const input of inputs)
    for (const token of input.split(/\s+/)) {
      if (token === '') continue;
      const [modifier, rawUtil] = splitModifier(token);
      const util = rawUtil.startsWith('!') ? rawUtil.slice(1) : rawUtil;
      const key = modifier + group(util);
      const prev = seen.get(key);
      if (prev === undefined) {
        seen.set(key, out.length);
        out.push(token);
      } else {
        out[prev] = token;
      }
    }

  return out.join(' ');
}
