import { useNavigate } from 'react-router-dom';
import Stopwatch from '../components/StopWatch';
import Timer from '../components/timer';
import Countdown from '../components/Countdown';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Timer App</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {user.username}</span>
            <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Stopwatch />
          <Timer />
          <Countdown />
        </div>
      </div>
    </div>
  );
}
