import { useRef } from 'react';
import { SaveMenu } from './SaveMenu';
import type { SaveFormat } from '../image/types';
import type { Tool } from '../tools/types';

interface ToolbarProps {
  onFile: (file: File) => void;
  onSave: (format: SaveFormat) => void;
  canSave: boolean;
  tool: Tool;
  onToolChange: (tool: Tool) => void;
  toolsDisabled: boolean;
  onOpenLevels: () => void;
  levelsDisabled: boolean;
  onOpenResize: () => void;
  resizeDisabled: boolean;
  onOpenKernel: () => void;
  kernelDisabled: boolean;
}

export function Toolbar({
  onFile,
  onSave,
  canSave,
  tool,
  onToolChange,
  toolsDisabled,
  onOpenLevels,
  levelsDisabled,
  onOpenResize,
  resizeDisabled,
  onOpenKernel,
  kernelDisabled,
}: ToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
    e.target.value = '';
  };

  const toggleTool = (next: Tool) => {
    onToolChange(tool === next ? 'none' : next);
  };

  return (
    <header className="toolbar">
      <span className="toolbar__brand">GrayBit Image Editor</span>
      <div className="toolbar__tools">
        <button
          type="button"
          className={`btn${tool === 'eyedropper' ? ' btn--active' : ''}`}
          disabled={toolsDisabled}
          title="Пипетка — клик по пикселю покажет его цвет"
          onClick={() => toggleTool('eyedropper')}
        >
          Пипетка
        </button>
        <button
          type="button"
          className="btn"
          disabled={levelsDisabled}
          title="Открыть инструмент «Уровни»"
          onClick={onOpenLevels}
        >
          Уровни…
        </button>
        <button
          type="button"
          className="btn"
          disabled={resizeDisabled}
          title="Открыть инструмент «Размер изображения»"
          onClick={onOpenResize}
        >
          Размер…
        </button>
        <button
          type="button"
          className="btn"
          disabled={kernelDisabled}
          title="Открыть инструмент «Фильтрация ядром»"
          onClick={onOpenKernel}
        >
          Фильтр…
        </button>
      </div>
      <div className="toolbar__actions">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,.gb7"
          onChange={handleChange}
          hidden
        />
        <button type="button" className="btn" onClick={handleClick}>
          Загрузить…
        </button>
        <SaveMenu disabled={!canSave} onPick={onSave} />
      </div>
    </header>
  );
}
