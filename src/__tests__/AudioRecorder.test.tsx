import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react';
import { AudioRecorder } from '../components/AudioRecorder';

// Use a longer timeout for all tests in this file
jest.setTimeout(10000);

describe('AudioRecorder', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  // Use Promise.resolve() for flushing promises
  const flushPromises = async () => {
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();  // Run twice to ensure all state updates are processed
    });
  };

  it('renders record button initially', () => {
    render(<AudioRecorder />);
    const button = screen.queryByRole('button', { name: /start recording/i });
    expect(button).toBeInTheDocument();
  });

  it('changes to stop button when recording starts', async () => {
    render(<AudioRecorder />);
    
    const startButton = screen.getByRole('button', { name: /start recording/i });
    
    await act(async () => {
      fireEvent.click(startButton);
    });
    await flushPromises();

    const stopButton = screen.queryByRole('button', { name: /stop recording/i });
    expect(stopButton).toBeInTheDocument();
  });

  it('shows play button and triggers onSave after recording is complete', async () => {
    const onSave = jest.fn();
    render(<AudioRecorder onSave={onSave} />);
    
    // Start recording
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /start recording/i }));
    });
    await flushPromises();
    
    // Stop recording
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /stop recording/i }));
    });
    await flushPromises();
    
    const playButton = screen.queryByRole('button', { name: /play/i });
    expect(playButton).toBeInTheDocument();
    expect(onSave).toHaveBeenCalled();
  });

  it('updates timer while recording', async () => {
    render(<AudioRecorder />);
    
    // Start recording
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /start recording/i }));
    });
    await flushPromises();
    
    // Initial time
    expect(screen.getByText('0:00')).toBeInTheDocument();
    
    // Advance timer by 5 seconds
    await act(async () => {
      jest.advanceTimersByTime(5000);
    });
    await flushPromises();
    
    const timeDisplay = screen.getByText((content) => {
      return content.startsWith('0:0') && content.endsWith('5');
    });
    expect(timeDisplay).toBeInTheDocument();
  });

  it('completes full recording lifecycle with delete', async () => {
    const onDelete = jest.fn();
    const onSave = jest.fn();
    
    render(<AudioRecorder onDelete={onDelete} onSave={onSave} />);
    
    // Start Recording
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /start recording/i }));
    });
    await flushPromises();
    
    // Stop Recording
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /stop recording/i }));
    });
    await flushPromises();
    
    expect(onSave).toHaveBeenCalled();
    
    // Delete Recording
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /delete recording/i }));
    });
    await flushPromises();
    
    expect(onDelete).toHaveBeenCalled();
    const startButton = screen.queryByRole('button', { name: /start recording/i });
    expect(startButton).toBeInTheDocument();
  }, 10000); // Add timeout for this specific test
});