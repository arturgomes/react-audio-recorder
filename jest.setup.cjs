require('@testing-library/jest-dom');

// Mock MediaRecorder
class MockMediaRecorder {
  constructor() {
    this.state = 'inactive';
    this.ondataavailable = null;
    this.onstop = null;
    this.onstart = null;
  }
  
  start() {
    this.state = 'recording';
    if (this.onstart) this.onstart(new Event('start'));
    if (this.ondataavailable) {
      // Simulate data available event
      this.ondataavailable(new Event('dataavailable', {
        data: new Blob(['test'], { type: 'audio/webm' })
      }));
    }
  }
  
  stop() {
    this.state = 'inactive';
    if (this.ondataavailable) {
      // Ensure final data is available
      this.ondataavailable(new Event('dataavailable', {
        data: new Blob(['test'], { type: 'audio/webm' })
      }));
    }
    if (this.onstop) {
      this.onstop(new Event('stop'));
    }
  }
}

globalThis.MediaRecorder = MockMediaRecorder;
globalThis.MediaRecorder.isTypeSupported = () => true;

// Mock URL
globalThis.URL.createObjectURL = jest.fn(() => 'mock-url');
globalThis.URL.revokeObjectURL = jest.fn();

// Mock Audio
globalThis.Audio = class {
  constructor() {
    this.play = jest.fn();
    this.pause = jest.fn();
  }
};

// Mock getUserMedia
globalThis.navigator.mediaDevices = {
  getUserMedia: jest.fn().mockImplementation(() => Promise.resolve({
    getTracks: () => [{
      stop: jest.fn()
    }]
  }))
};