import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import './PhaseDetail.css';

export default function PhaseDetail() {
  const { slug } = useParams();
  const { isStudent } = useAuth();
  const [phase, setPhase] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPhase(slug)
      .then(setPhase)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="page">
        <div className="loading"><div className="spinner" /></div>
      </div>
    );
  }

  if (!phase) {
    return (
      <div className="page">
        <div className="container">
          <p>Fase não encontrada.</p>
          <Link to="/fases">Voltar às fases</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page phase-detail">
      <div className="container">
        <Link to="/fases" className="back-link">← Voltar às fases</Link>

        <div className="phase-detail-header">
          <div className="phase-detail-badge">
            <span className="badge badge-accent">Fase {phase.number}</span>
            <span className="badge badge-accent">{phase.duration_weeks} semanas</span>
          </div>
          <h1>{phase.title}</h1>
          <p className="phase-detail-objective">{phase.objective}</p>

          {phase.progress && (
            <div className="phase-detail-progress card">
              <div className="phase-detail-progress-info">
                <span>Progresso: {phase.progress.completedLessons}/{phase.progress.totalLessons} aulas</span>
                <span>{phase.progress.percentage}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${phase.progress.percentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="phase-detail-grid">
          <section className="phase-section">
            <h2>Aulas</h2>
            <div className="lessons-list">
              {phase.lessons.map((lesson, index) => {
                const completed = phase.lessonProgress?.[lesson.id];
                return (
                  <Link
                    key={lesson.id}
                    to={`/fases/${slug}/aulas/${lesson.slug}`}
                    className={`lesson-item card ${completed ? 'lesson-completed' : ''}`}
                  >
                    <span className="lesson-index">{index + 1}</span>
                    <div className="lesson-info">
                      <h3>{lesson.title}</h3>
                      <div className="lesson-tags">
                        {lesson.type === 'project' && (
                          <span className="badge badge-accent">Projeto</span>
                        )}
                        {isStudent ? (
                          <span className="badge badge-video">▶ Vídeo</span>
                        ) : (
                          <span className="badge badge-locked">🔒 Vídeo</span>
                        )}
                      </div>
                    </div>
                    {completed && <span className="lesson-check">✓</span>}
                  </Link>
                );
              })}
            </div>
          </section>

          <aside className="phase-sidebar">
            {phase.project && (
              <div className="sidebar-card card">
                <h3>Projeto</h3>
                <p>{phase.project}</p>
              </div>
            )}

            <div className="sidebar-card card">
              <h3>Resultado Esperado</h3>
              <p>{phase.expected_result}</p>
            </div>

            {phase.exercises.length > 0 && (
              <div className="sidebar-card card">
                <h3>Exercícios ({phase.exercises.length})</h3>
                <ul className="exercise-list">
                  {phase.exercises.map((ex) => (
                    <li key={ex.id}>
                      <strong>{ex.title}</strong>
                      <p>{ex.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {phase.tools.length > 0 && (
              <div className="sidebar-card card">
                <h3>Ferramentas</h3>
                <ul className="tools-list">
                  {phase.tools.map((tool) => (
                    <li key={tool.id}>
                      {tool.url ? (
                        <a href={tool.url} target="_blank" rel="noopener noreferrer">
                          {tool.name} ↗
                        </a>
                      ) : (
                        tool.name
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
