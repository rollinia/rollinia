/**
 * Internal symbol keys used to brand a {@link VxInstance}.
 *
 * - `CONFIG` holds the resolved configuration at runtime so an instance can be
 *   fed back into another `vx(...)` call for composition.
 * - `VARIANTS` is a phantom (type-only) key that carries the instance's variant
 *   map so it can be recovered through inference. It is never assigned at
 *   runtime.
 */
export const CONFIG = Symbol('VX_CONFIG');
export const VARIANTS = Symbol('VX_VARIANTS');
