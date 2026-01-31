import { LinkIcon, Music, X, Youtube } from 'lucide-react';

interface Props {
  input: string;
  embedUrl: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export default function YouTubeInputField({
  input,
  embedUrl,
  onChange,
  onClear,
}: Props) {
  if (embedUrl) {
    return (
      <div className="relative flex max-h-14 w-120 flex-1 items-center justify-center">
        <div className="bg-opacity-10 group flex h-full w-full items-center justify-between gap-4 rounded-full border border-zinc-700 bg-zinc-900 px-6 transition-colors hover:border-orange-500/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <Youtube size={16} className="shrink-0" />
            <span className="truncate text-sm text-zinc-300">
              Playing Youtube...
            </span>
          </div>
          <button
            onClick={onClear}
            className="rounded-full p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex max-h-14 w-120 flex-1 items-center justify-center">
      <div className="group relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-zinc-600">
          <LinkIcon size={16} />
        </div>
        <input
          type="text"
          value={input}
          onChange={onChange}
          className="h-14 w-full rounded-full border border-zinc-800 bg-zinc-900/50 py-3 pr-12 pl-12 text-sm text-zinc-300 placeholder-zinc-700 shadow-sm transition-all outline-none hover:border-zinc-700 focus:border-orange-500"
          placeholder="Paste YouTube URL..."
        />
        <div
          className={`pointer-events-none absolute top-1/2 right-5 flex -translate-y-1/2 gap-3 transition-opacity ${
            input ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <Music size={16} className={'text-zinc-700'} />
        </div>
      </div>
    </div>
  );
}
