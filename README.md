# React Student Audio Recorder

A React component for recording audio with a student-friendly UI. Features include audio compression, time limits, and a clean, intuitive interface.

## Features

- 🎙️ Simple audio recording interface
- ⏱️ Configurable recording time limit
- 🗜️ Audio compression (opus codec)
- 🎯 Customizable callbacks for save/delete actions
- 📱 Responsive design with Tailwind CSS
- 🎨 Clean, intuitive UI with clear status indicators
- ♿ Accessible with ARIA labels
- 🧪 Fully tested with Jest

## Installation

```bash
npm install react-audio-recrd
```

## Usage

```jsx
import { AudioRecorder } from 'react-audio-recrd';

function App() {
  const handleSave = (blob) => {
    // Handle the recorded audio blob
    console.log('Recorded audio:', blob);
    
    // Example: Upload to server
    const formData = new FormData();
    formData.append('audio', blob, 'recording.webm');
    // fetch('/api/upload', { method: 'POST', body: formData });
  };

  const handleDelete = () => {
    // Handle deletion
    console.log('Recording deleted');
  };

  return (
    <AudioRecorder
      onSave={handleSave}
      onDelete={handleDelete}
      maxDuration={300} // 5 minutes
      compressionBitsPerSecond={96000} // 96kbps
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSave` | `(blob: Blob) => void` | `() => {}` | Callback when recording is saved |
| `onDelete` | `() => void` | `() => {}` | Callback when recording is deleted |
| `maxDuration` | `number` | `300` | Maximum recording duration in seconds |
| `compressionFormat` | `string` | `'audio/webm;codecs=opus'` | Audio compression format |
| `compressionBitsPerSecond` | `number` | `96000` | Audio bitrate in bits per second |

## Browser Support

This component uses the MediaRecorder API. Check [browser compatibility](https://caniuse.com/mediarecorder) for support details.

The component requires these browser features:
- MediaRecorder API
- getUserMedia API
- Web Audio API

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build package
npm run build

# Lint code
npm run lint
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT © Artur Gomes

## Notes

- The component uses Opus codec for audio compression, providing good quality at low bitrates
- Recording automatically stops when reaching maxDuration
- Designed with accessibility in mind, including proper ARIA labels and keyboard navigation
- Uses Tailwind CSS for styling - make sure Tailwind is configured in your project

## Support

If you find any bugs or have feature requests, please create an issue in the GitHub repository.