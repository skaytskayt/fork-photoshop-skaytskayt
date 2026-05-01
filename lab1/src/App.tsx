import { useState } from 'react';
import { Toolbar } from './components/Toolbar';
import { CanvasView } from './components/CanvasView';
import { loadImageFile } from './image/load';
import type { ImageDoc } from './image/types';

export default function App() {
  const [doc, setDoc] = useState<ImageDoc | null>(null);

  const handleFile = async (file: File) => {
    try {
      const next = await loadImageFile(file);
      setDoc(next);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="app">
      <Toolbar onFile={handleFile} />
      <CanvasView doc={doc} />
    </div>
  );
}
