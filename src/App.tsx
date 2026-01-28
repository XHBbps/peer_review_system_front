import { Routes, Route, Navigate } from 'react-router-dom';
import AuthCallback from './pages/AuthCallback';
import TaskList from './pages/TaskList';
import ReviewForm from './pages/ReviewForm';
import Header from './components/layout/Header';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/" element={<TaskList />} />
          <Route path="/review/:taskId" element={<ReviewForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
