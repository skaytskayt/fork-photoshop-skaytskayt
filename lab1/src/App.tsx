import { useState } from 'react';
import { Toolbar } from './components/Toolbar';
import { CanvasView } from './components/CanvasView';
import { StatusBar } from './components/StatusBar';
import { loadImageFile } from './image/load';
import type { ImageDoc } from './image/types';

export default function App() {
  const [doc, setDoc] = useState<ImageDoc | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    try {
      const next = await loadImageFile(file);
      setDoc(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <div className="app">
      <Toolbar onFile={handleFile} />
      <CanvasView doc={doc} />
      <StatusBar doc={doc} error={error} />
    </div>
  );
}
