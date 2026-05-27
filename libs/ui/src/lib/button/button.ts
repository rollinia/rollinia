import { Directive } from '@angular/core';

import { vx } from '../vx';

export const props = vx({
  variants: {
    variant: {},
    size: {},
  },
});

export type Props = typeof props.Type;

@Directive({
  selector: '[rButton]',
  host: { '[class]': 'props()' },
})
export class Button {
  props = props();
}
