/**
 * Anilix Website - Main Entry Point
 */
import { initScene } from './three-scene.js';
import { initAnimations } from './animations.js';
import { initTerminal } from './terminal.js';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('three-canvas');
  initScene(canvas);
  initAnimations();
  initTerminal();
});
