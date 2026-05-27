import { signal } from '@angular/core';

import { vx } from './vx';

// Type-level: every composed instance's variants are visible on the result.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const composed = vx(vx({ variants: { bla: { ho: '' } } }), {
  variants: { variant: { solid: '' }, size: { sm: '' } },
});
type Composed = typeof composed.Type;
type _AssertBla = Composed['bla']; // 'ho' | undefined
type _AssertVariant = Composed['variant']; // 'solid' | undefined
type _AssertSize = Composed['size']; // 'sm' | undefined
const _checkBla: _AssertBla = 'ho';
const _checkVariant: _AssertVariant = 'solid';
const _checkSize: _AssertSize = undefined;
void _checkBla;
void _checkVariant;
void _checkSize;

describe('vx', () => {
  it('emits the base classes', () => {
    const props = vx({ base: 'inline-flex rounded-md' });
    expect(props({})()).toBe('inline-flex rounded-md');
  });

  it('applies a selected variant', () => {
    const props = vx({
      base: 'btn',
      variants: { size: { sm: 'h-9', lg: 'h-11' } },
    });
    expect(props({ size: 'lg' })()).toBe('btn h-11');
  });

  it('falls back to defaults when no value is given', () => {
    const props = vx({
      variants: { size: { sm: 'h-9', lg: 'h-11' } },
      defaults: { size: 'sm' },
    });
    expect(props({})()).toBe('h-9');
    expect(props({ size: 'lg' })()).toBe('h-11');
  });

  it('reacts to signal inputs', () => {
    const size = signal<'sm' | 'lg' | undefined>('sm');
    const props = vx({ variants: { size: { sm: 'h-9', lg: 'h-11' } } });
    const classes = props({ size });
    expect(classes()).toBe('h-9');
    size.set('lg');
    expect(classes()).toBe('h-11');
  });

  it('applies compound rules when all conditions match', () => {
    const props = vx({
      variants: {
        variant: { link: 'underline', solid: 'bg-primary' },
        size: { icon: 'h-10 w-10', default: 'h-10 px-4' },
      },
      compound: [{ variant: 'link', size: 'icon', class: 'p-0' }],
    });
    expect(props({ variant: 'link', size: 'icon' })()).toContain('p-0');
    expect(props({ variant: 'solid', size: 'icon' })()).not.toContain('p-0');
  });

  it('composes instances, later overriding earlier', () => {
    const a = vx({ base: 'rounded-md p-2' });
    const b = vx({ base: 'p-4' });
    const props = vx(a, b, { base: 'font-medium' });
    expect(props({})()).toBe('rounded-md p-4 font-medium');
  });

  it('merges variant maps across composed instances', () => {
    const a = vx({ variants: { size: { sm: 'h-9' } } });
    const props = vx(a, { variants: { tone: { ghost: 'bg-transparent' } } });
    expect(props({ size: 'sm', tone: 'ghost' })()).toBe('h-9 bg-transparent');
  });
});
