import { useState, useRef, useEffect } from 'react';

export default function Countdown() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      clearInterval(intervalRef.current);
      playBeep();
    }
  }, [timeLeft, isRunning]);

  const start = () => {
    const totalMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
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
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  const playBeep = () => {
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
    const hrs = Math.floor(ms / 3600000);
    const mins = Math.floor((ms % 3600000) / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const millis = Math.floor((ms % 1000) / 10);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${millis.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Countdown Timer</h3>
      
      {!isRunning && timeLeft === 0 ? (
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
              <input
                type="number"
                placeholder="00"
                value={hours === 0 ? '' : hours}
                onChange={(e) => setHours(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
                className="w-full p-2 border rounded text-center text-2xl font-mono"
                min="0"
                max="23"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minutes</label>
              <input
                type="number"
                placeholder="00"
                value={minutes === 0 ? '' : minutes}
                onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                className="w-full p-2 border rounded text-center text-2xl font-mono"
                min="0"
                max="59"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seconds</label>
              <input
                type="number"
                placeholder="00"
                value={seconds === 0 ? '' : seconds}
                onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                className="w-full p-2 border rounded text-center text-2xl font-mono"
                min="0"
                max="59"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-4xl font-mono mb-4">{formatTime(timeLeft)}</div>
      )}
      
      <div className="flex gap-2">
        <button 
          onClick={start}
          disabled={isRunning || (hours === 0 && minutes === 0 && seconds === 0)}
          className={`px-4 py-2 rounded ${isRunning || (hours === 0 && minutes === 0 && seconds === 0) ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} text-white`}
        >
          Start
        </button>
        <button 
          onClick={stop}
          disabled={!isRunning}
          className={`px-4 py-2 rounded ${!isRunning ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'} text-white`}
        >
          Stop
        </button>
        <button 
          onClick={reset} 
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
