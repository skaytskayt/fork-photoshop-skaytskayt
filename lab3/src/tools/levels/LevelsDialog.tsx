import { useEffect, useMemo, useRef, useState } from 'react';
import { computeHistograms, selectHistogram, type HistogramSet } from './histogram';
import { HistogramView, type HistogramScale } from './HistogramView';
import { CHANNEL_OPTIONS, type ChannelKey } from './channelKeys';
import { InputLevels } from './InputLevels';
import type { LevelsParams } from './levelsState';
import {
  buildChannelLuts,
  defaultByChannel,
  hasAnyChange,
  type LevelsByChannel,
} from './buildChannelLuts';
import { applyLuts } from './applyLevels';

interface LevelsDialogProps {
  open: boolean;

  source: ImageData | null;
  hasAlpha: boolean;
  onClose: () => void;

  onPreview: (preview: ImageData | null) => void;
}

export function LevelsDialog({
  open,
  source,
  hasAlpha,
  onClose,
  onPreview,
}: LevelsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [channel, setChannel] = useState<ChannelKey>('master');
  const [scale, setScale] = useState<HistogramScale>('linear');

  const [byChannel, setByChannel] = useState<LevelsByChannel>(defaultByChannel);
  const [previewEnabled, setPreviewEnabled] = useState(true);

  const histograms: HistogramSet | null = useMemo(
    () => (source ? computeHistograms(source) : null),
    [source],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();

      setChannel('master');
      setByChannel(defaultByChannel());
      setPreviewEnabled(true);
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handler = () => onClose();
    dialog.addEventListener('close', handler);
    return () => dialog.removeEventListener('close', handler);
  }, [onClose]);

  const channelOptions = hasAlpha
    ? CHANNEL_OPTIONS
    : CHANNEL_OPTIONS.filter((o) => o.key !== 'alpha');

  const bins = histograms ? selectHistogram(histograms, channel) : null;
  const params = byChannel[channel];
  const setParams = (next: LevelsParams) =>
    setByChannel((prev) => ({ ...prev, [channel]: next }));

  useEffect(() => {
    if (!open) {
      onPreview(null);
      return;
    }
    if (!source || !previewEnabled) {
      onPreview(null);
      return;
    }
    if (!hasAnyChange(byChannel)) {
      onPreview(null);
      return;
    }
    const luts = buildChannelLuts(byChannel);
    onPreview(applyLuts(source, luts));
  }, [open, source, previewEnabled, byChannel, onPreview]);

  return (
    <dialog ref={dialogRef} className="levels">
      <form method="dialog" className="levels__form">
        <header className="levels__header">
          <h2 className="levels__title">Уровни</h2>
          <button
            type="button"
            className="levels__close"
            aria-label="Закрыть"
            onClick={onClose}
          >
            ✕
          </button>
        </header>

        <div className="levels__row">
          <label className="levels__field">
            <span>Канал</span>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as ChannelKey)}
            >
              {channelOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <div className="histogram__scale" role="tablist" aria-label="Шкала">
            <button
              type="button"
              className={scale === 'linear' ? 'is-active' : ''}
              onClick={() => setScale('linear')}
            >
              Linear
            </button>
            <button
              type="button"
              className={scale === 'log' ? 'is-active' : ''}
              onClick={() => setScale('log')}
            >
              Log
            </button>
          </div>
        </div>

        <div className="histogram">
          <HistogramView
            bins={bins}
            globalMax={histograms?.maxCount ?? 0}
            channel={channel}
            scale={scale}
          />
          <InputLevels params={params} onChange={setParams} />
        </div>

        <label className="levels__preview">
          <input
            type="checkbox"
            checked={previewEnabled}
            onChange={(e) => setPreviewEnabled(e.target.checked)}
          />
          Предпросмотр
        </label>
      </form>
    </dialog>
  );
}
