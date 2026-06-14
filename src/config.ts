// Centralized runtime-config for backend/gateway URL
export function getGatewayUrl(): string {
  try {
    // 1) Allow runtime override via global injected var (useful for native wrappers)
    const injected = (window as any).__GATEWAY_URL__;
    if (injected && typeof injected === 'string' && injected.length > 0) return injected;

    // 2) Allow runtime override via meta tag: <meta name="gateway-url" content="http://...">
    const meta = document.querySelector('meta[name="gateway-url"]') as HTMLMetaElement | null;
    if (meta && meta.content) return meta.content;

    // 3) Allow localStorage override for quick testing without rebuilding
    const ls = window.localStorage.getItem('GATEWAY_URL');
    if (ls) return ls;

    // 4) Default fallback (local LAN IP)
    return 'http://192.168.0.197:8081';
  } catch (err) {
    // In case document/window not available, fallback to default
    return 'http://192.168.0.197:8081';
  }
}

export function setGatewayUrl(url: string) {
  try { window.localStorage.setItem('GATEWAY_URL', url); } catch (e) {}
}
