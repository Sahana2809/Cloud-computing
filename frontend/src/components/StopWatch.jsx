import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const playBeep = (frequency = 800, duration = 200) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  };

  const start = () => {
    if (!isRunning) {
      playBeep(1000, 150);
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    }
  };

  const stop = () => {
    playBeep(600, 300);
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  const reset = () => {
    playBeep(400, 150);
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setTime(0);
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Stopwatch</h3>
      <div className="text-4xl font-mono mb-4">{formatTime(time)}</div>
      <div className="flex gap-2">
        <button onClick={start} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Start
        </button>
        <button onClick={stop} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
          Stop
        </button>
        <button onClick={reset} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Reset
        </button>
      </div>
    </div>
  );
}
