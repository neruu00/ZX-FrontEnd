import YouTube from 'react-youtube';

interface Props {
  embedUrl: string | null;
}

export default function YouTubePlayer({ embedUrl }: Props) {
  if (!embedUrl) return null;

  return (
    <div className="group relative aspect-video w-full overflow-hidden rounded-lg bg-zinc-900 shadow-2xl">
      <YouTube
        videoId={embedUrl}
        opts={{
          height: '100%',
          width: '100%',
          playerVars: {
            autoplay: 0,
            controls: 1,
            loop: 0,
            playlist: embedUrl,
            modestbranding: 1,
            rel: 0,
          },
        }}
        className="h-full w-full"
        iframeClassName="w-full h-full"
      />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
    </div>
  );
}
