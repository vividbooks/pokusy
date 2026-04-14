import { useMemo } from "react";

type Props = {
  /** ID videa z URL youtube.com/watch?v=… nebo …/embed/… */
  videoId: string;
  title: string;
};

/**
 * Vložený YouTube přehrávač (iframe). Parametr `origin` + referrer řeší chybu 153 u embedů.
 */
export function YouTubeEmbed({ videoId, title }: Props) {
  const src = useMemo(() => {
    const u = new URL(`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`);
    u.searchParams.set("rel", "0");
    u.searchParams.set("modestbranding", "1");
    if (typeof window !== "undefined") {
      u.searchParams.set("origin", window.location.origin);
    }
    return u.toString();
  }, [videoId]);

  return (
    <div className="exp-ux-video-wrap">
      <iframe
        title={title}
        src={src}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
