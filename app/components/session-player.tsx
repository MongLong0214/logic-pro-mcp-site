"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

const clock = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;

export function SessionPlayer() {
  const video = useRef<HTMLVideoElement>(null);
  const poster = useRef<HTMLImageElement>(null);
  const spectrum = useRef<HTMLCanvasElement>(null);
  const audio = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const frequencyData = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const recordingUrl = useRef<string | null>(null);
  const download = useRef<AbortController | null>(null);
  const frame = useRef<number>(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState("");
  const [analysisAvailable, setAnalysisAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  // The first frame is a plain server-rendered <img>; the <video> only exists once playback is requested.
  const [videoPoster, setVideoPoster] = useState<string | null>(null);
  useEffect(() => () => {
    cancelAnimationFrame(frame.current);
    download.current?.abort();
    if (recordingUrl.current) URL.revokeObjectURL(recordingUrl.current);
    if (audio.current) void audio.current.close().catch(() => {});
  }, []);
  function draw() {
    const node = analyser.current;
    const canvas = spectrum.current;
    if (!node || !canvas || video.current?.paused) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const bins = frequencyData.current;
    if (!bins) return;
    node.getByteFrequencyData(bins);
    context.clearRect(0, 0, canvas.width, canvas.height);
    const count = 96;
    const spacing = canvas.width / count;
    for (let index = 0; index < count; index++) {
      // Log-distributed bins from the actual recording, never generated meter values.
      const bin = Math.min(bins.length - 1, Math.round(Math.pow(bins.length, index / count) - 1));
      const height = bins[bin] / 255 * (canvas.height - 4);
      context.fillStyle = index < count / 2 ? "#d4ed77" : "#819781";
      context.fillRect(index * spacing, canvas.height - height, Math.max(1, spacing - 2), height);
    }
    frame.current = requestAnimationFrame(draw);
  }
  async function prepareAudio() {
    const media = video.current;
    if (!media) return;
    let source: MediaElementAudioSourceNode | undefined;
    try {
      if (!audio.current) {
        audio.current = new AudioContext();
      }
      const context = audio.current;
      // Resume can stay pending or be denied. Do not capture native audio until
      // the optional graph is actually running, and never make playback await it.
      await context.resume();
      if (context.state !== "running" || !media.isConnected) return;
      if (!analyser.current) {
        const node = context.createAnalyser();
        node.fftSize = 2048;
        node.smoothingTimeConstant = 0.75;
        node.connect(context.destination);
        source = context.createMediaElementSource(media);
        source.connect(node);
        analyser.current = node;
        frequencyData.current = new Uint8Array(node.frequencyBinCount);
      }
      setAnalysisAvailable(true);
      cancelAnimationFrame(frame.current);
      draw();
    } catch {
      // Audio analysis is progressive enhancement; ordinary video playback stays available.
      if (source && audio.current?.state === "running") {
        source.disconnect();
        source.connect(audio.current.destination);
      }
      if (media.isConnected) setAnalysisAvailable(false);
    }
  }
  async function loadRecording(media: HTMLVideoElement) {
    if (recordingUrl.current) return;
    const controller = new AbortController();
    download.current = controller;
    // Load only after a gesture. A local object URL also supports seeking on hosts
    // whose static-file server does not implement byte-range responses.
    const response = await fetch("/session-demo.mp4", { signal: controller.signal });
    if (!response.ok) throw new Error("Recording unavailable");
    const bytes = await response.arrayBuffer();
    if (controller.signal.aborted || !media.isConnected) return;
    recordingUrl.current = URL.createObjectURL(new Blob([bytes], { type: "video/mp4" }));
    media.src = recordingUrl.current;
  }
  async function toggle() {
    if (loading) return;
    if (!video.current) flushSync(() => setVideoPoster(poster.current?.currentSrc || "/session-poster.webp"));
    const media = video.current;
    if (!media) return;
    if (!media.paused) { media.pause(); return; }
    setLoading(true);
    try {
      void prepareAudio();
      await loadRecording(media);
      if (!media.isConnected) return;
      await media.play();
      setError("");
    } catch {
      if (media.isConnected) setError("Playback unavailable. Open the original recording below.");
    } finally { if (media.isConnected) setLoading(false); }
  }
  // Hand-sized WebP assets with a srcset; the optimizer route would add a request hop for the LCP image.
  // eslint-disable-next-line @next/next/no-img-element
  const firstFrame = <img ref={poster} src="/session-poster.webp" srcSet="/session-poster-660.webp 660w, /session-poster.webp 1024w" sizes="(max-width: 1100px) 90vw, 1200px" width="1024" height="576" alt="Poster frame of the Logic Pro MCP demo. The full film is a real Claude Code session on Logic Pro 13.0 with v3.19.0: 14 writes, each read back, median round trip 437 ms." fetchPriority="high" decoding="async" />;
  return <div className="session-player">
    <div className="player-label"><span>SESSION 001 / FROM PROMPT TO PLAYBACK</span><span>ARCHIVED RECORDING</span></div>
    <div className="video-stage">
      {videoPoster === null
        ? firstFrame
        : <video ref={video} poster={videoPoster} preload="none" playsInline muted={muted}
        onPlay={() => { setPlaying(true); cancelAnimationFrame(frame.current); draw(); }}
        onPause={() => { setPlaying(false); cancelAnimationFrame(frame.current); }}
        onEnded={() => { setPlaying(false); cancelAnimationFrame(frame.current); }}
        onTimeUpdate={() => setTime(video.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(video.current?.duration ?? 0)}
        onError={() => setError("Recording unavailable. Open the original below.")}
        aria-label="Logic Pro MCP demo recording, with audio. The full 130.8 second film is linked as Original." />}
      {!playing && <button className="stage-play" disabled={loading} onClick={toggle} aria-label={time > 0 ? "Resume recording" : "Play recording"}><span aria-hidden="true">▶</span><span>{loading ? "Loading session…" : time > 0 ? "Resume session" : "Hear the session"}</span></button>}
    </div>
    <div className="spectrum-strip"><span>{playing && analysisAvailable ? "RECORDING SPECTRUM" : "PLAY TO EXPLORE THE AUDIO"}</span><canvas ref={spectrum} width="768" height="40" aria-hidden="true" /><span>WEB AUDIO / LOCAL</span></div>
    <div className="transport-controls">
      <button disabled={loading} onClick={toggle} aria-label={playing ? "Pause recording" : "Play recording"}>{loading ? "Loading…" : playing ? "Pause" : "Play"}</button>
      <span className="player-time">{clock(time)} / {duration ? clock(duration) : "–:––"}</span>
      <input aria-label="Recording position" type="range" min="0" max={duration || 1} step="0.1" value={time} disabled={!duration}
        onChange={event => { const next = Number(event.target.value); if (video.current) video.current.currentTime = next; setTime(next); }} />
      <button aria-pressed={muted} onClick={() => setMuted(!muted)}>{muted ? "Sound off" : "Sound on"}</button>
      <a href="https://github.com/MongLong0214/logic-pro-mcp/blob/main/docs/media/logic-pro-mcp-demo.mp4">Original</a>
    </div>
    {error && <p className="player-error" role="status">{error}</p>}
  </div>;
}
