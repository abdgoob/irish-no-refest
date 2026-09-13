function reverseVideoSrc(forwardSrc: string): string {
  return forwardSrc.replace(/\.mp4(\?.*)?$/i, "-reverse.mp4$1");
}

function setVideoSource(video: HTMLVideoElement, src: string): void {
  video.innerHTML = "";
  const source = document.createElement("source");
  source.src = src;
  source.type = "video/mp4";
  video.appendChild(source);
  video.load();
  void video.play().catch(() => {});
}

/**
 * Bloom with the forward clip, unbloom with a pre-reversed clip (smooth decode),
 * then swap back and repeat.
 */
export function bindPrologueVideoPingPong(
  video: HTMLVideoElement,
): () => void {
  video.loop = false;

  let forwardSrc = video.currentSrc || video.querySelector("source")?.src || "";
  let playingForward = true;

  const captureForwardSrc = () => {
    forwardSrc =
      video.currentSrc || video.querySelector("source")?.src || forwardSrc;
  };

  if (!forwardSrc) {
    video.addEventListener("loadeddata", captureForwardSrc, { once: true });
  }

  const onEnded = () => {
    captureForwardSrc();
    if (!forwardSrc) return;

    if (playingForward) {
      playingForward = false;
      setVideoSource(video, reverseVideoSrc(forwardSrc));
      return;
    }

    playingForward = true;
    setVideoSource(video, forwardSrc);
  };

  video.addEventListener("ended", onEnded);

  return () => {
    video.removeEventListener("loadeddata", captureForwardSrc);
    video.removeEventListener("ended", onEnded);
  };
}
