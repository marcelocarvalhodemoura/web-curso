import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import './Phases.css';

export default function Phases() {
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPhases()
      .then(setPhases)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="loading"><div className="spinner" /></div>
      </div>
    );
  }

  return (
    <div className="page phases-page">
      <div className="container">
        <div className="page-header">
          <h1>Trilha de Aprendizagem</h1>
          <p>10 fases do iniciante absoluto ao desenvolvedor júnior</p>
        </div>

        <div className="phases-grid">
          {phases.map((phase) => (
            <Link key={phase.id} to={`/fases/${phase.slug}`} className="phase-card card">
              <div className="phase-card-top">
                <span className="phase-number">Fase {phase.number}</span>
                <span className="badge badge-accent">{phase.duration_weeks} semanas</span>
              </div>
              <h2>{phase.title}</h2>
              <p className="phase-objective">{phase.objective}</p>
              <div className="phase-meta">
                <span>{phase.lessonCount} aulas</span>
                <span>{phase.exerciseCount} exercícios</span>
              </div>
              {phase.progress && (
                <div className="phase-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${phase.progress.percentage}%` }}
                    />
                  </div>
                  <span className="phase-progress-text">{phase.progress.percentage}%</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
