import { useEffect, useRef } from 'react';
import type { ImageDoc } from '../image/types';

interface CanvasViewProps {
  doc: ImageDoc | null;
}

export function CanvasView({ doc }: CanvasViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !doc) return;

    canvas.width = doc.width;
    canvas.height = doc.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.putImageData(doc.pixels, 0, 0);
  }, [doc]);

  return (
    <main className="workspace">
      {doc === null ? (
        <div className="workspace__placeholder">
          Загрузите изображение, чтобы начать. Поддерживаются PNG, JPG и GB7.
        </div>
      ) : (
        <canvas ref={canvasRef} className="workspace__canvas" />
      )}
    </main>
  );
}
