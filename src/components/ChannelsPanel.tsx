import { useEffect, useMemo, useRef } from 'react';
import type { ImageDoc } from '../image/types';
import type { ChannelInfo, ChannelKey, ChannelLayout } from '../image/channels';
import { makeChannelThumbnail } from '../image/channelThumbnails';

interface ChannelsPanelProps {
  doc: ImageDoc | null;
  layout: ChannelLayout | null;
  active: Set<ChannelKey>;
  onToggle: (key: ChannelKey) => void;
}

const THUMB_SIZE = 96;

export function ChannelsPanel({ doc, layout, active, onToggle }: ChannelsPanelProps) {
  if (!doc || !layout) {
    return (
      <section className="panel panel--channels">
        <h3 className="panel__title">Каналы</h3>
        <p className="panel__hint">Загрузите изображение, чтобы увидеть его каналы.</p>
      </section>
    );
  }

  return (
    <section className="panel panel--channels">
      <h3 className="panel__title">Каналы</h3>
      <ul className="channels">
        {layout.channels.map((ch) => (
          <ChannelRow
            key={ch.key}
            doc={doc}
            channel={ch}
            active={active.has(ch.key)}
            onToggle={() => onToggle(ch.key)}
          />
        ))}
      </ul>
    </section>
  );
}

interface ChannelRowProps {
  doc: ImageDoc;
  channel: ChannelInfo;
  active: boolean;
  onToggle: () => void;
}

function ChannelRow({ doc, channel, active, onToggle }: ChannelRowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const thumb = useMemo(
    () => makeChannelThumbnail(doc.pixels, channel.key, THUMB_SIZE),
    [doc.pixels, channel.key],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = thumb.width;
    canvas.height = thumb.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.putImageData(thumb, 0, 0);
  }, [thumb]);

  return (
    <li className={`channel${active ? ' channel--active' : ''}`}>
      <label className="channel__row">
        <input
          type="checkbox"
          className="channel__checkbox"
          checked={active}
          onChange={onToggle}
        />
        <canvas ref={canvasRef} className="channel__thumb" />
        <span className="channel__meta">
          <span className="channel__label">{channel.label}</span>
          <span className="channel__hint">{channel.description}</span>
        </span>
      </label>
    </li>
  );
}
