import { useEffect, useRef } from 'react';
import { resizeImage } from '../image/interpolation';
import type { Tool } from '../tools/types';

interface CanvasViewProps {
  pixels: ImageData | null;
  scale: number;
  workspaceRef: React.RefObject<HTMLDivElement>;
  tool: Tool;
  onPick?: (x: number, y: number) => void;
}

export function CanvasView({ pixels, scale, workspaceRef, tool, onPick }: CanvasViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const canvas = canvasRef.current;
    if (!canvas || !pixels) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;

      const dstW = Math.max(1, Math.round((pixels.width * scale) / 100));
      const dstH = Math.max(1, Math.round((pixels.height * scale) / 100));

      canvas.width = dstW;
      canvas.height = dstH;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (scale === 100) {
        ctx.putImageData(pixels, 0, 0);
      } else {
        const scaled = resizeImage(pixels, dstW, dstH, 'bilinear');
        ctx.putImageData(scaled, 0, 0);
      }
    });

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [pixels, scale]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool !== 'eyedropper' || !onPick || !pixels) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * pixels.width);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * pixels.height);
    if (x < 0 || y < 0 || x >= pixels.width || y >= pixels.height) return;
    onPick(x, y);
  };

  const cursorClass = tool === 'eyedropper' ? ' workspace__canvas--pick' : '';

  return (
    <main className="workspace" ref={workspaceRef}>
      {pixels === null ? (
        <div className="workspace__placeholder">
          Загрузите изображение, чтобы начать. Поддерживаются PNG, JPG и GB7.
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          className={`workspace__canvas${cursorClass}`}
          onClick={handleClick}
        />
      )}
    </main>
  );
}
