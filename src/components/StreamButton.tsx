import React from 'react';
import { StreamLink } from '../types';

interface StreamButtonProps {
  stream: StreamLink;
}

const platformColors: Record<string, string> = {
  twitch: 'bg-purple-600',
  youtube: 'bg-red-600',
  other: 'bg-gray-600',
};

const StreamButton: React.FC<StreamButtonProps> = ({ stream }) => {
  return (
    <a
      href={stream.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block px-4 py-2 rounded text-white font-bold shadow ${platformColors[stream.platform] || 'bg-gray-600'} hover:opacity-80 transition`}
    >
      Watch on {stream.platform.charAt(0).toUpperCase() + stream.platform.slice(1)}
    </a>
  );
};

export default StreamButton; 