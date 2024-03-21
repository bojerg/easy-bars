import { animation, style, animate, trigger, transition, useAnimation } from '@angular/animations';

export const phraseAnimation = animation([
  style({
    opacity: '{{ opacity }}',
    backgroundColor: '{{ backgroundColor }}'
  }),
  animate('{{ time }}'),
]);

// I'm lost a bit right now
// Thinking queuing up/triggering animations for playback rather than changing the HTML every 30ms lol
// Just need to learn more about angular animations first