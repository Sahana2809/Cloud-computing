import { useState, useRef, useEffect } from 'react';

export default function Countdown() {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      clearInterval(intervalRef.current);
      playBeep();
    }
  }, [timeLeft, isRunning]);

  const start = () => {
    const totalMs = (minutes * 60 + seconds) * 1000;
    if (totalMs > 0 && !isRunning) {
      setTimeLeft(totalMs);
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => Math.max(prev - 10, 0));
      }, 10);
    }
  };

  const stop = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  const reset = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setTimeLeft(0);
  };

  const playBeep = () => {
    // Create beep using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const formatTime = (ms) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const millis = Math.floor((ms % 1000) / 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${millis.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Countdown Timer</h3>
      {!isRunning && timeLeft === 0 ? (
        <div className="mb-4">
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              placeholder="Minutes"
              value={minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
              className="w-24 p-2 border rounded"
              min="0"
            />
            <input
              type="number"
              placeholder="Seconds"
              value={seconds}
              onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
              className="w-24 p-2 border rounded"
              min="0"
              max="59"
            />
          </div>
        </div>
      ) : (
        <div className="text-4xl font-mono mb-4">{formatTime(timeLeft)}</div>
      )}
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
