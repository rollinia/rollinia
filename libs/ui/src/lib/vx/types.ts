import { type Signal } from '@angular/core';

import { type CONFIG, type VARIANTS } from './config';

/** Map of variant name → (variant value → class string). */
export type Variants = Record<string, Record<string, string>>;

/** The empty variant map: no keys, used as the inferred default. */
export type EmptyVariants = Record<never, never>;

/** A plain value, or a reactive {@link Signal} producing that value. */
export type SignalInput<T> = T | Signal<T>;

/** One optional selected value per variant (the static, non-reactive view). */
export type VariantProps<V> = {
  [K in keyof V]?: keyof V[K];
};

/** Reactive inputs accepted by a {@link VxInstance}: value or signal per variant. */
export type VariantInputs<V> = {
  [K in keyof V]?: SignalInput<keyof V[K] | undefined>;
};

/**
 * A compound rule: when every listed variant equals the given value, the
 * `class` string is appended. Keys and values are checked against `V`.
 */
export type CompoundRule<V extends Variants> = VariantProps<V> & {
  class: string;
};

/** The object accepted as the final argument of {@link vx}. */
export interface Definition<V extends Variants = Variants> {
  base?: string;
  variants?: V;
  compound?: readonly CompoundRule<V>[];
  defaults?: VariantProps<V>;
}

/** Internal, fully merged configuration carried by an instance. */
export interface Resolved {
  base: readonly string[];
  variants: Variants;
  compound: readonly { when: Record<string, string>; class: string }[];
  defaults: Record<string, string>;
}

/**
 * The value returned by {@link vx}. It is callable — `instance(inputs)` returns
 * a `Signal<string>` of merged classes — and also composable: pass it back into
 * another `vx(...)` call.
 *
 * Use `typeof instance.Type` to derive a clean props type, e.g.
 * `type Props = typeof props.Type` → `{ variant?: …; size?: … }`, so
 * `Props['variant']` lists only the real variants (not `Function` members).
 */
export type VxInstance<V> = ((inputs?: VariantInputs<V>) => Signal<string>) & {
  readonly [CONFIG]: Resolved;
  readonly [VARIANTS]?: V;
  /** Phantom carrier of the variant-props bag; never read at runtime. */
  readonly Type: Prettify<VariantProps<V>>;
};

/** Recover the variant map carried by an instance type. */
export type VariantsOf<I> = I extends { readonly [VARIANTS]?: infer V }
  ? V extends Variants
    ? V
    : EmptyVariants
  : EmptyVariants;

/** Collapse an intersection into a single, mutable, flattened object. */
export type Prettify<T> = { -readonly [K in keyof T]: T[K] } & {};

/** Merge two variant-value records; keys present in `B` override `A`. */
type MergeGroup<A, B> = Prettify<Omit<A, keyof B> & B>;

/** Deep-merge two variant maps; `B` overrides `A` per variant and per value. */
export type MergeVariants<A, B> = Prettify<{
  [K in keyof A | keyof B]: K extends keyof B
    ? K extends keyof A
      ? MergeGroup<A[K], B[K]>
      : B[K]
    : K extends keyof A
      ? A[K]
      : never;
}>;

/** Deep-merge the variant maps of a tuple of instances, left to right. */
export type MergeInstances<
  T extends readonly unknown[],
  Acc = EmptyVariants,
> = T extends readonly [infer H, ...infer R]
  ? MergeInstances<R, MergeVariants<Acc, VariantsOf<H>>>
  : Acc;

/** Mutable shape used while accumulating a {@link Resolved} config. */
export interface Draft {
  base: string[];
  variants: Record<string, Record<string, string>>;
  compound: { when: Record<string, string>; class: string }[];
  defaults: Record<string, string>;
}
