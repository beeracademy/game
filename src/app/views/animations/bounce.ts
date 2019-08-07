import {
  animation,
  style,
  animate,
  keyframes
} from '@angular/animations';

const DEFAULT_TIMING = 1;

export const bounceIn = animation(
  animate(
    '{{ timing }}s {{ delay }}s cubic-bezier(0.215, 0.610, 0.355, 1.000)',
    keyframes([
      style({ opacity: 0, transform: 'scale3d(.3, .3, .3)', offset: 0 }),
      style({ transform: 'scale3d(1.1, 1.1, 1.1)', offset: 0.2 }),
      style({ transform: 'scale3d(.9, .9, .9)', offset: 0.4 }),
      style({
        opacity: 1,
        transform: 'scale3d(1.03, 1.03, 1.03)',
        offset: 0.6
      }),
      style({ transform: 'scale3d(.97, .97, .97)', offset: 0.8 }),
      style({ opacity: 1, transform: 'scale3d(1, 1, 1)', offset: 1 })
    ])
  ),
  { params: { timing: DEFAULT_TIMING, delay: 0 } }
);

export const bounceOut = animation(
  animate(
    '{{ timing }}s {{ delay }}s',
    keyframes([
      style({ transform: 'scale3d(.9, .9, .9)', offset: 0.2 }),
      style({
        opacity: 1,
        transform: 'scale3d({{ scale }}, {{ scale }}, {{ scale }})',
        offset: 0.5
      }),
      style({
        opacity: 1,
        transform: 'scale3d({{ scale }}, {{ scale }}, {{ scale }})',
        offset: 0.55
      }),
      style({ opacity: 0, transform: 'scale3d(.3, .3, .3)', offset: 1 })
    ])
  ),
  { params: { timing: DEFAULT_TIMING, delay: 0, scale: 1.1 } }
);
