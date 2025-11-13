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

  const start = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 10);
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
    setTime(0);
  };

  const addLap = async () => {
    const lapTime = formatTime(time);
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
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Timer with Laps</h3>
      <div className="text-4xl font-mono mb-4">{formatTime(time)}</div>
      <div className="flex gap-2 mb-4">
        <button onClick={start} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Start
        </button>
        <button onClick={stop} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
          Stop
        </button>
        <button onClick={reset} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Reset
        </button>
        <button onClick={addLap} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
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
