interface WordRevealProps {
  text: string;
  className?: string;
  delayStart?: number;
  wordDelay?: number;
}

/** Splits text into words, each clipped inside its own overflow-hidden box
 * so it can rise into place independently — a staged cascade instead of
 * the whole headline fading in as one block. Server-renderable (no
 * interactivity needed, just per-word animation-delay). The trailing space
 * after each word lives outside the clipped box so normal line-wrapping
 * still happens at word boundaries. */
export function WordReveal({
  text,
  className,
  delayStart = 0,
  wordDelay = 55,
}: WordRevealProps) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i}>
          <span className="inline-block overflow-hidden pb-[0.15em] align-bottom">
            <span
              className="animate-word-in inline-block motion-reduce:animate-none"
              style={{ animationDelay: `${delayStart + i * wordDelay}ms` }}
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}
