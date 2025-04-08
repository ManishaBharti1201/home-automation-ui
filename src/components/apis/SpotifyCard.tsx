import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SkipBack, SkipForward, Pause, Play } from 'lucide-react';
import spotify from '../../assets/spotify.png'; // Import the Spotify logo

interface SpotifyTrack {
    name: string;
    album: {
        images: { url: string }[];
    };
    artists: { name: string }[];
}

interface SpotifyCardProps {
    artistName?: string;
    songName?: string;
    duration?: number;
    albumArt?: string;
}

const SpotifyCard: React.FC<SpotifyCardProps> = ({
    artistName = "Artist Name",
    songName = "Song Name",
    duration = 195, // 3:15 in seconds
    albumArt = spotify
}) => {
    const [track, setTrack] = useState<SpotifyTrack | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const fetchCurrentTrack = async () => {
        try {
            const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
                headers: {
                    Authorization: `Bearer YOUR_SPOTIFY_ACCESS_TOKEN`,
                },
            });
            if (response.data && typeof response.data === 'object' && 'item' in response.data && 'is_playing' in response.data) {
                const { item, is_playing } = response.data as { item: SpotifyTrack; is_playing: boolean };
                setTrack(item);
                setIsPlaying(is_playing);
            }
        } catch (error) {
            console.error('Error fetching current track:', error);
        }
    };

    const handlePlayPause = async () => {
        try {
            const endpoint = isPlaying
                ? 'https://api.spotify.com/v1/me/player/pause'
                : 'https://api.spotify.com/v1/me/player/play';
            await axios.put(endpoint, {}, {
                headers: {
                    Authorization: `Bearer YOUR_SPOTIFY_ACCESS_TOKEN`,
                },
            });
            setIsPlaying(!isPlaying);
        } catch (error) {
            console.error('Error toggling play/pause:', error);
        }
    };

    useEffect(() => {
        fetchCurrentTrack();
        const interval = setInterval(fetchCurrentTrack, 10000); // Refresh every 10 seconds
        return () => clearInterval(interval);
    }, []);


    return (
        <div className='device-card' style={{
            backgroundImage: `url(${spotify})`, // Set Spotify logo as background image
            backgroundSize: '50% 100%', // Ensure the image covers the entire card
            backgroundPosition: 'right', // Center the image
            backgroundRepeat: 'no-repeat',
             // Prevent the image from repeating
            padding: '16px',
            borderRadius: '16px',
            boxShadow: '0 4px 8px rgba(168, 56, 56, 0.2)',

        }}>
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add a semi-transparent overlay
                    borderRadius: '16px',
                }}
            ></div>
            <div className="bg-teal-600 p-6 rounded-3xl shadow-xl max-w-md mx-auto">
                <div className="device-name">Garage Lights</div>
                <div className="device-status">Active for 3 hours</div>

                <div className="device-status">
                    <button className="text-white focus:outline-none">
                        <SkipBack size={24} />
                    </button>
                    <button
                        className="text-white focus:outline-none"
                        onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    <button className="text-white focus:outline-none">
                        <SkipForward size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SpotifyCard;