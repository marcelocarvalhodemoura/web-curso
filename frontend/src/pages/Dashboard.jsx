import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (user) {
      api.getProgress()
        .then(setProgress)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="page">
        <div className="loading"><div className="spinner" /></div>
      </div>
    );
  }

  return (
    <div className="page dashboard">
      <div className="container">
        <div className="page-header">
          <h1>Olá, {user.name}!</h1>
          <p>Acompanhe seu progresso na trilha</p>
        </div>

        <div className="dashboard-overview card">
          <div className="overview-stats">
            <div className="overview-stat">
              <span className="overview-value">{progress.overallPercentage}%</span>
              <span className="overview-label">Progresso Geral</span>
            </div>
            <div className="overview-stat">
              <span className="overview-value">{progress.completedLessons}/{progress.totalLessons}</span>
              <span className="overview-label">Aulas Concluídas</span>
            </div>
            <div className="overview-stat">
              <span className="overview-value">{progress.completedPhases}/{progress.totalPhases}</span>
              <span className="overview-label">Fases Completas</span>
            </div>
          </div>
          <div className="progress-bar overview-bar">
            <div className="progress-bar-fill" style={{ width: `${progress.overallPercentage}%` }} />
          </div>
        </div>

        <h2 className="dashboard-section-title">Progresso por Fase</h2>
        <div className="phase-progress-list">
          {progress.phases.map((phase) => (
            <Link
              key={phase.phaseId}
              to={`/fases/${phase.phaseSlug}`}
              className="phase-progress-card card"
            >
              <div className="phase-progress-header">
                <span className="phase-progress-number">Fase {phase.phaseNumber}</span>
                {phase.percentage === 100 && phase.total > 0 && (
                  <span className="badge badge-success">Completa</span>
                )}
              </div>
              <h3>{phase.phaseTitle}</h3>
              <div className="phase-progress-info">
                <span>{phase.completed}/{phase.total} aulas</span>
                <span>{phase.percentage}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${phase.percentage}%` }} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
