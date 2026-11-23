import * as THREE from 'three';

/**
 * Generates high-DPI procedural textures directly on HTML5 Canvas
 * so zero external image assets are ever needed.
 */
export function createSiliconMicrogridTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#070b12';
  ctx.fillRect(0, 0, size, size);

  // Fine architectural grid
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.09)';
  ctx.lineWidth = 1;
  const step = 32;
  for (let i = 0; i <= size; i += step) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(size, i);
    ctx.stroke();
  }

  // Micro logic vias at intersections
  ctx.fillStyle = 'rgba(0, 229, 255, 0.22)';
  for (let x = step; x < size; x += step * 2) {
    for (let y = step; y < size; y += step * 2) {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.needsUpdate = true;
  return texture;
}

export function createNodeBadgeTexture(label: string, accentHex: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#090e18';
  ctx.fillRect(0, 0, 256, 128);

  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 3;
  ctx.strokeRect(6, 6, 244, 116);

  ctx.fillStyle = accentHex;
  ctx.font = '600 26px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, 128, 66);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}