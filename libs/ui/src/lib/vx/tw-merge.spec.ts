import { twMerge } from './tw-merge';

describe('twMerge', () => {
  it('keeps non-conflicting classes', () => {
    expect(twMerge('inline-flex items-center rounded-md')).toBe(
      'inline-flex items-center rounded-md',
    );
  });

  it('lets later classes win within a group', () => {
    expect(twMerge('px-2 px-4')).toBe('px-4');
    expect(twMerge('h-9', 'h-11')).toBe('h-11');
  });

  it('treats text size and text color as separate groups', () => {
    expect(twMerge('text-sm text-primary')).toBe('text-sm text-primary');
    expect(twMerge('text-sm text-lg')).toBe('text-lg');
  });

  it('treats ring width and ring color as separate groups', () => {
    expect(twMerge('ring-2 ring-4 ring-ring')).toBe('ring-4 ring-ring');
  });

  it('treats border width and border color as separate groups', () => {
    expect(twMerge('border border-2 border-input')).toBe(
      'border-2 border-input',
    );
  });

  it('scopes conflicts per modifier', () => {
    expect(twMerge('bg-primary hover:bg-accent')).toBe(
      'bg-primary hover:bg-accent',
    );
    expect(twMerge('hover:bg-primary hover:bg-accent')).toBe('hover:bg-accent');
  });

  it('does not split colons inside arbitrary values', () => {
    // Built by concatenation so Tailwind's scanner never sees the literal
    // arbitrary class (which would emit an unresolvable `url(a:b)`).
    const arbitrary = 'bg-' + '[url(a:b)]';
    expect(twMerge(`${arbitrary} bg-accent`)).toBe('bg-accent');
  });

  it('distinguishes padding sides', () => {
    expect(twMerge('px-4 py-2')).toBe('px-4 py-2');
  });
});
