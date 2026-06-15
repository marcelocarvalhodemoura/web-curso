import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Phases from './pages/Phases';
import PhaseDetail from './pages/PhaseDetail';
import Lesson from './pages/Lesson';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="fases" element={<Phases />} />
        <Route path="fases/:slug" element={<PhaseDetail />} />
        <Route path="fases/:phaseSlug/aulas/:lessonSlug" element={<Lesson />} />
      </Route>
    </Routes>
  );
}
