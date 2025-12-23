import { useEffect, useMemo, useRef, useCallback } from 'react';
import { useGesture } from '@use-gesture/react';
import './DomeGallery.css';

const DEFAULT_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=600', alt: 'Winter scene' },
  { src: 'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=600', alt: 'Christmas lights' },
  { src: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=600', alt: 'Holiday decor' },
  { src: 'https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?w=600', alt: 'Family gathering' },
  { src: 'https://images.unsplash.com/photo-1545622783-b3e021430fee?w=600', alt: 'Christmas tree' },
  { src: 'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?w=600', alt: 'Snowy landscape' },
  { src: 'https://images.unsplash.com/photo-1481819613568-3701cbc70156?w=600', alt: 'Winter night' },
];

const DEFAULTS = {
  maxVerticalRotationDeg: 5,
  dragSensitivity: 20,
  segments: 35
};

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const wrapAngleSigned = deg => {
  const a = (((deg + 180) % 360) + 360) % 360;
  return a - 180;
};

function buildItems(pool, seg) {
  const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
  const evenYs = [-4, -2, 0, 2, 4];
  const oddYs = [-3, -1, 1, 3, 5];
  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs;
    return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }));
  });
  const totalSlots = coords.length;
  if (pool.length === 0) return coords.map(c => ({ ...c, src: '', alt: '' }));
  const normalizedImages = pool.map(image => {
    if (typeof image === 'string') return { src: image, alt: '' };
    return { src: image.src || '', alt: image.alt || '' };
  });
  const usedImages = Array.from({ length: totalSlots }, (_, i) => normalizedImages[i % normalizedImages.length]);
  return coords.map((c, i) => ({ ...c, src: usedImages[i].src, alt: usedImages[i].alt }));
}

export default function DomeGallery({
  images = DEFAULT_IMAGES,
  fit = 0.5,
  minRadius = 600,
  maxRadius = Infinity,
  padFactor = 0.25,
  overlayBlurColor = '#0a1628',
  maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg,
  dragSensitivity = DEFAULTS.dragSensitivity,
  segments = DEFAULTS.segments,
  dragDampening = 2,
  imageBorderRadius = '16px',
  grayscale = false
}) {
  const rootRef = useRef(null);
  const mainRef = useRef(null);
  const sphereRef = useRef(null);
  const rotationRef = useRef({ x: 0, y: 0 });
  const startRotRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef(null);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const inertiaRAF = useRef(null);

  const items = useMemo(() => buildItems(images, segments), [images, segments]);

  const applyTransform = (xDeg, yDeg) => {
    const el = sphereRef.current;
    if (el) {
      el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
    }
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(entries => {
      const cr = entries[0].contentRect;
      const w = Math.max(1, cr.width), h = Math.max(1, cr.height);
      const minDim = Math.min(w, h);
      let radius = minDim * fit;
      const heightGuard = h * 1.35;
      radius = Math.min(radius, heightGuard);
      radius = clamp(radius, minRadius, maxRadius);
      const viewerPad = Math.max(8, Math.round(minDim * padFactor));
      root.style.setProperty('--radius', `${Math.round(radius)}px`);
      root.style.setProperty('--viewer-pad', `${viewerPad}px`);
      root.style.setProperty('--overlay-blur-color', overlayBlurColor);
      root.style.setProperty('--tile-radius', imageBorderRadius);
      root.style.setProperty('--image-filter', grayscale ? 'grayscale(1)' : 'none');
      applyTransform(rotationRef.current.x, rotationRef.current.y);
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [fit, minRadius, maxRadius, padFactor, overlayBlurColor, grayscale, imageBorderRadius]);

  useEffect(() => {
    applyTransform(rotationRef.current.x, rotationRef.current.y);
  }, []);

  const stopInertia = useCallback(() => {
    if (inertiaRAF.current) {
      cancelAnimationFrame(inertiaRAF.current);
      inertiaRAF.current = null;
    }
  }, []);

  const startInertia = useCallback((vx, vy) => {
    const MAX_V = 1.4;
    let vX = clamp(vx, -MAX_V, MAX_V) * 80;
    let vY = clamp(vy, -MAX_V, MAX_V) * 80;
    let frames = 0;
    const d = clamp(dragDampening ?? 0.6, 0, 1);
    const frictionMul = 0.94 + 0.055 * d;
    const stopThreshold = 0.015 - 0.01 * d;
    const maxFrames = Math.round(90 + 270 * d);
    const step = () => {
      vX *= frictionMul;
      vY *= frictionMul;
      if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) {
        inertiaRAF.current = null;
        return;
      }
      if (++frames > maxFrames) {
        inertiaRAF.current = null;
        return;
      }
      const nextX = clamp(rotationRef.current.x - vY / 200, -maxVerticalRotationDeg, maxVerticalRotationDeg);
      const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200);
      rotationRef.current = { x: nextX, y: nextY };
      applyTransform(nextX, nextY);
      inertiaRAF.current = requestAnimationFrame(step);
    };
    stopInertia();
    inertiaRAF.current = requestAnimationFrame(step);
  }, [dragDampening, maxVerticalRotationDeg, stopInertia]);

  useGesture({
    onDragStart: ({ event }) => {
      stopInertia();
      const evt = event;
      draggingRef.current = true;
      movedRef.current = false;
      startRotRef.current = { ...rotationRef.current };
      startPosRef.current = { x: evt.clientX, y: evt.clientY };
    },
    onDrag: ({ event, last, velocity = [0, 0], direction = [0, 0] }) => {
      if (!draggingRef.current || !startPosRef.current) return;
      const evt = event;
      const dxTotal = evt.clientX - startPosRef.current.x;
      const dyTotal = evt.clientY - startPosRef.current.y;
      if (!movedRef.current) {
        const dist2 = dxTotal * dxTotal + dyTotal * dyTotal;
        if (dist2 > 16) movedRef.current = true;
      }
      const nextX = clamp(startRotRef.current.x - dyTotal / dragSensitivity, -maxVerticalRotationDeg, maxVerticalRotationDeg);
      const nextY = wrapAngleSigned(startRotRef.current.y + dxTotal / dragSensitivity);
      if (rotationRef.current.x !== nextX || rotationRef.current.y !== nextY) {
        rotationRef.current = { x: nextX, y: nextY };
        applyTransform(nextX, nextY);
      }
      if (last) {
        draggingRef.current = false;
        let [vMagX, vMagY] = velocity;
        const [dirX, dirY] = direction;
        let vx = vMagX * dirX;
        let vy = vMagY * dirY;
        if (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005) startInertia(vx, vy);
        movedRef.current = false;
      }
    }
  }, { target: mainRef, eventOptions: { passive: true } });

  return (
    <div ref={rootRef} className="sphere-root" style={{
      '--segments-x': segments,
      '--segments-y': segments,
      '--overlay-blur-color': overlayBlurColor,
      '--tile-radius': imageBorderRadius,
      '--image-filter': grayscale ? 'grayscale(1)' : 'none'
    }}>
      <main ref={mainRef} className="sphere-main">
        <div className="stage">
          <div ref={sphereRef} className="sphere">
            {items.map((it, i) => (
              <div key={`${it.x},${it.y},${i}`} className="item" style={{
                '--offset-x': it.x,
                '--offset-y': it.y,
                '--item-size-x': it.sizeX,
                '--item-size-y': it.sizeY
              }}>
                <div className="item__image">
                  <img src={it.src} draggable={false} alt={it.alt} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="overlay" />
        <div className="overlay overlay--blur" />
        <div className="edge-fade edge-fade--top" />
        <div className="edge-fade edge-fade--bottom" />
      </main>
    </div>
  );
}
