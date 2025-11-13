import { useState, useRef, useEffect } from 'react';
import API from '../api';

export default function Timer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchLaps();
  }, []);

  const fetchLaps = async () => {
    try {
      const { data } = await API.get('/laps');
      setLaps(data.filter(lap => lap.type === 'timer'));
    } catch (error) {
      console.error('Error fetching laps:', error);
    }
  };

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

  const addLap = async () => {
    // Only allow lap when timer is running
    if (!isRunning) {
      return;
    }
    
    const lapTime = formatTime(time);
    playBeep(800, 100);
    try {
      await API.post('/laps', { lap_time: lapTime, type: 'timer' });
      fetchLaps();
    } catch (error) {
      console.error('Error adding lap:', error);
    }
  };

  const deleteLap = async (id) => {
    try {
      await API.delete(`/laps/${id}`);
      fetchLaps();
    } catch (error) {
      console.error('Error deleting lap:', error);
    }
  };

  const formatTime = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Timer with Laps</h3>
      <div className="text-4xl font-mono mb-4">{formatTime(time)}</div>
      <div className="flex gap-2 mb-4">
        <button 
          onClick={start} 
          disabled={isRunning}
          className={`px-4 py-2 rounded ${isRunning ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} text-white`}
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
        <button 
          onClick={addLap} 
          disabled={!isRunning}
          className={`px-4 py-2 rounded ${!isRunning ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
        >
          Lap
        </button>
      </div>
      <div className="max-h-48 overflow-y-auto">
        {laps.map((lap, index) => (
          <div key={lap.id} className="flex justify-between items-center p-2 border-b">
            <span>Lap {laps.length - index}: {lap.lap_time}</span>
            <button onClick={() => deleteLap(lap.id)} className="text-red-500 hover:text-red-700">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
