import React, { useState } from 'react';

const NetworkSpeedTest: React.FC = () => {
    const [downloadSpeed, setDownloadSpeed] = useState<string | null>(null);
    const [uploadSpeed, setUploadSpeed] = useState<string | null>(null);
    const [isTesting, setIsTesting] = useState(false);

    const testNetworkSpeed = async () => {
        setIsTesting(true);

        // Measure download speed
        const downloadStartTime = performance.now();
        const downloadData = new Uint8Array(1e6); // 1MB dummy data
        await fetch(URL.createObjectURL(new Blob([downloadData])));
        const downloadEndTime = performance.now();
        const downloadDuration = (downloadEndTime - downloadStartTime) / 1000; // in seconds
        const downloadSpeedMbps = (8 / downloadDuration).toFixed(2); // Mbps
        setDownloadSpeed(downloadSpeedMbps);

        // Measure upload speed
        const uploadStartTime = performance.now();
        await fetch('https://httpbin.org/post', {
            method: 'POST',
            body: new Blob([downloadData]),
        });
        const uploadEndTime = performance.now();
        const uploadDuration = (uploadEndTime - uploadStartTime) / 1000; // in seconds
        const uploadSpeedMbps = (8 / uploadDuration).toFixed(2); // Mbps
        setUploadSpeed(uploadSpeedMbps);

        setIsTesting(false);
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', width: '300px' }}>
            <h3>WiFi Speed Test</h3>
            <button onClick={testNetworkSpeed} disabled={isTesting}>
                {isTesting ? 'Testing...' : 'Test Speed'}
            </button>
            <div style={{ marginTop: '20px' }}>
                <p>Download Speed: {downloadSpeed ? `${downloadSpeed} Mbps` : 'N/A'}</p>
                <p>Upload Speed: {uploadSpeed ? `${uploadSpeed} Mbps` : 'N/A'}</p>
            </div>
        </div>
    );
};

export default NetworkSpeedTest;