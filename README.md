# Pixel Quest

An original browser platformer inspired by classic 8-bit mechanics. This is not a reproduction of Nintendo's characters, artwork, music, or course data.

8 worlds × 4 courses, variable-height jumps, acceleration, running, stomps, shells, breakable blocks, power-ups, fireballs, timed invincibility, lives, checkpoints, moving platforms, secret bonus rooms, and bosses. Keyboard, touch and standard gamepad inputs. Original synthesized music and effects. Device-local course progress.

Artwork: [Kenney Pixel Platformer](https://kenney.nl/assets/pixel-platformer), CC0. License included in `dist/assets/LICENSE.txt`.

Serve `dist` using any HTTP server. No package installation or build is needed. Arrows/A/D to move, Z/Space to jump, X/Shift to run/fire, Down to enter a marked passage, P/Escape to pause.

`dist/engine.mjs` is a browser-independent fixed-step simulation. `dist/game.js` handles rendering, input, audio, and the UI. Run `node --test tests/engine.test.mjs` to check physics and course structure.
