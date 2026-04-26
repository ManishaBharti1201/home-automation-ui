import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import axios from 'axios';

interface Props {
  id: string; // unique id for stream (used by gateway)
  rtspUrl?: string; // optional: provide RTSP URL directly
  gatewayBase?: string; // e.g. http://localhost:8000
  onLog?: (type: 'API' | 'UPDATE' | 'SYSTEM' | 'ERROR', message: string, detail?: string) => void;
}

const DEFAULT_GATEWAY = 'http://localhost:8000';

export default function CameraCard({ id, rtspUrl, gatewayBase = DEFAULT_GATEWAY, onLog }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hlsUrl, setHlsUrl] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;
    async function start() {
      if (!id) return;
      setStarting(true);
      try {
        let resp;
        if (rtspUrl) {
          onLog?.('API', `Request: Local Stream ${id}`, `Source: ${rtspUrl}`);
          // direct RTSP provided (local testing)
          resp = await axios.post<{ hls: string }>(`${gatewayBase}/api/stream/start`, { id, streamUrl: rtspUrl }, { timeout: 10000 });
        } else {
          onLog?.('API', `Request: Tuya Stream ${id}`, `Allocating endpoint...`);
          // use Tuya allocate endpoint on the gateway which keeps secrets server-side
          resp = await axios.post<{ hls: string, streamUrl?: string }>(`${gatewayBase}/api/stream/start-tuya`, { id, deviceId: id }, { timeout: 10000 });
        }
        const url = resp.data.hls;
        if (!mounted) return;
        const fullUrl = url.startsWith('http') ? url : `${gatewayBase}${url}`;
        // wait for manifest to appear to avoid 404 race (use exponential backoff)
        const exists = await waitForManifestWithBackoff(fullUrl, 40000);
        if (!mounted) return;
        if (!exists) {
          throw new Error('HLS manifest not available');
        }
        setHlsUrl(fullUrl);
        setError(null);
        onLog?.('UPDATE', `Stream Active: ${id}`, `HLS Manifest ready`);
      } catch (err) {
        console.error('start stream error', err);
        const anyErr: any = err;
        onLog?.('ERROR', `Stream Failure: ${id}`, anyErr.message || 'Connection timeout');
        if (anyErr && anyErr.response && anyErr.response.data) {
          setError(anyErr.response.data.error || JSON.stringify(anyErr.response.data));
        } else if (anyErr && anyErr.message) {
          setError(anyErr.message);
        } else {
          setError(String(anyErr));
        }
      } finally {
        setStarting(false);
      }
    }
    start();
    return () => {
      mounted = false;
      axios.post(`${gatewayBase}/api/stream/stop`, { id }).catch(() => {});
    };
  }, [id, rtspUrl, gatewayBase, onLog]);

  // Poll manifest using HEAD then GET with exponential backoff
  async function waitForManifestWithBackoff(url: string, timeout = 20000) {
    const start = Date.now();
    let attempt = 0;
    while (Date.now() - start < timeout) {
      try {
        // prefer HEAD to save bandwidth; fall back to GET if server doesn't allow
        try {
          const head = await axios.head(url, { timeout: 3000 });
          if (head.status === 200) return true;
        } catch (headErr) {
          // try GET as fallback
          const res = await axios.get(url, { timeout: 3000 });
          if (res.status === 200) return true;
        }
      } catch (e) {
        // ignore and continue to backoff
      }
      attempt += 1;
      const backoff = Math.min(2000, 200 * Math.pow(2, attempt));
      // add some jitter
      const jitter = Math.round(Math.random() * 200);
      await new Promise((r) => setTimeout(r, backoff + jitter));
    }
    return false;
  }

  useEffect(() => {
    if (!hlsUrl || !videoRef.current) return;
    const video = videoRef.current;
    video.crossOrigin = 'anonymous';
    video.muted = true; // allow autoplay in modern browsers
    video.playsInline = true;
    video.autoplay = true;
    video.setAttribute('webkit-playsinline', 'true');

    // Prefer hls.js when available (Chrome/Firefox). Use native only if hls.js isn't supported.
    if (!Hls.isSupported() && video.canPlayType('application/vnd.apple.mpegurl')) {
      console.debug('Using native HLS support, setting src to', hlsUrl);
      video.src = hlsUrl;
      video.play().catch((e) => console.warn('native play failed', e));
      return;
    }

    const hls = new Hls({
      // IP camera streams often have timing or parsing irregularities.
      // These settings increase the player's resilience to noisy data.
      enableSoftwareAES: true,
      forceKeyFrameOnDiscontinuity: true,
      fragLoadingMaxRetry: 5,
    });
    // expose to window for debugging in DevTools
    try { (window as any).__hls_debug = hls; } catch (e) {}
    
    hls.on(Hls.Events.ERROR, (event, data) => {
      if (data.fatal) {
        console.error('hls fatal error', event, data);
        const errorMessage = data.reason || (data.error && data.error.message) || `${data.type} ${data.details || ''}`;
        setError(`Fatal HLS error: ${errorMessage}`);
        
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            console.warn('HLS network error, trying to recover');
            hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.warn('HLS media error, trying to recover');
            hls.recoverMediaError();
            break;
          default:
            console.error('HLS fatal error, destroying hls');
            hls.destroy();
            break;
        }
      } else {
        console.warn('hls non-fatal error (stall or warning)', data.details, data.reason || (data.error && data.error.message));
      }
    });
    hls.on(Hls.Events.MANIFEST_LOADED, () => console.debug('HLS manifest loaded'));
    hls.on(Hls.Events.FRAG_LOADED, () => console.debug('HLS fragment loaded'));
    hls.loadSource(hlsUrl);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch((e) => console.warn('hls play failed', e)));
    return () => { hls.destroy(); };
  }, [hlsUrl]);

  return (
    <div className="camera-card" style={{ width: '100%', height: '100%', position: 'relative', background: '#000', overflow: 'hidden' }}>
      {error ? (
        <div style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          color: '#f88',
          textAlign: 'center',
          padding: '1rem'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Streaming Error</div>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>{error}</div>
        </div>
      ) : (
        <>
          <video 
            ref={videoRef} 
            controls 
            style={{ width: '100%', height: '100%', background: '#000', objectFit: 'cover', display: 'block' }} 
          />
          
          {starting && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: 'rgba(0,0,0,0.5)' }}>
              Starting stream...
            </div>
          )}
          
          {!starting && !hlsUrl && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
              No stream available
            </div>
          )}
        </>
      )}
    </div>
  );
}
