import { computed, isSignal, type Signal } from '@angular/core';

import { CONFIG } from './config';
import { twMerge } from './tw-merge';
import type {
  Definition,
  Draft,
  MergeInstances,
  MergeVariants,
  Resolved,
  VariantInputs,
  Variants,
  VxInstance,
} from './types';

const isInstance = (x: unknown): x is VxInstance<Variants> =>
  typeof x === 'function' && CONFIG in x;

const isDefinition = (x: unknown): x is Definition =>
  typeof x === 'object' && x !== null;

/** Fold one resolved config into the draft (later values overriding earlier). */
function mergeResolved(draft: Draft, src: Resolved): void {
  draft.base.push(...src.base);
  for (const key of Object.keys(src.variants)) {
    const group = src.variants[key];
    if (group) draft.variants[key] = { ...draft.variants[key], ...group };
  }
  draft.compound.push(...src.compound);
  Object.assign(draft.defaults, src.defaults);
}

/** Normalize a user {@link Definition} into a {@link Resolved} config. */
function normalize(def: Definition): Resolved {
  const variants: Record<string, Record<string, string>> = {};
  if (def.variants)
    for (const key of Object.keys(def.variants)) {
      const group = def.variants[key];
      if (group) variants[key] = { ...group };
    }

  const compound: { when: Record<string, string>; class: string }[] = [];
  if (def.compound)
    for (const rule of def.compound) {
      const when: Record<string, string> = {};
      for (const key of Object.keys(rule)) {
        if (key === 'class') continue;
        const value = rule[key];
        if (typeof value === 'string') when[key] = value;
      }
      compound.push({ when, class: rule.class });
    }

  const defaults: Record<string, string> = {};
  if (def.defaults)
    for (const key of Object.keys(def.defaults)) {
      const value = def.defaults[key];
      if (typeof value === 'string') defaults[key] = value;
    }

  return { base: def.base ? [def.base] : [], variants, compound, defaults };
}

/** Compute the merged class string for one set of resolved selections. */
function render(resolved: Resolved, inputs: VariantInputs<Variants>): string {
  const selected: Record<string, string> = { ...resolved.defaults };
  for (const key of Object.keys(inputs)) {
    const raw = inputs[key];
    const value = isSignal(raw) ? raw() : raw;
    if (typeof value === 'string') selected[key] = value;
  }

  const classes = [...resolved.base];
  for (const key of Object.keys(selected)) {
    const value = selected[key];
    const cls =
      value === undefined ? undefined : resolved.variants[key]?.[value];
    if (cls) classes.push(cls);
  }

  for (const rule of resolved.compound) {
    let matches = true;
    for (const key of Object.keys(rule.when))
      if (selected[key] !== rule.when[key]) {
        matches = false;
        break;
      }
    if (matches) classes.push(rule.class);
  }

  return twMerge(classes.join(' '));
}

/**
 * Build a class-variants instance.
 *
 * Accepts any number of previously built instances followed by a single
 * {@link Definition}; configuration is merged left to right, so later sources
 * override earlier ones. The result is callable — pass reactive or static
 * variant inputs to get a `Signal<string>` of Tailwind classes (conflicts
 * resolved by {@link twMerge}) — and is itself composable into further calls.
 *
 * @example
 * const base = vx({ base: 'inline-flex rounded-md' });
 * export const props = vx(base, {
 *   variants: { size: { sm: 'h-8 px-3', lg: 'h-11 px-8' } },
 *   defaults: { size: 'sm' },
 * });
 * const classes = props({ size: mySizeSignal }); // Signal<string>
 */
export function vx<
  const Instances extends readonly { readonly [CONFIG]: Resolved }[],
  V extends Variants = Record<never, never>,
>(
  ...args: [...Instances, Definition<V>]
): VxInstance<MergeVariants<MergeInstances<Instances>, V>>;
export function vx(...args: readonly unknown[]): ((
  inputs?: VariantInputs<Variants>,
) => Signal<string>) & {
  readonly [CONFIG]: Resolved;
} {
  const draft: Draft = { base: [], variants: {}, compound: [], defaults: {} };

  for (let i = 0; i < args.length - 1; i++) {
    const inst = args[i];
    if (isInstance(inst)) mergeResolved(draft, inst[CONFIG]);
  }

  const last = args[args.length - 1];
  if (isDefinition(last)) mergeResolved(draft, normalize(last));

  const resolved: Resolved = draft;
  const run = (inputs: VariantInputs<Variants> = {}): Signal<string> =>
    computed(() => render(resolved, inputs));

  return Object.assign(run, { [CONFIG]: resolved });
}
