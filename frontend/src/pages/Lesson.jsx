import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import VideoPlayer from '../components/VideoPlayer';
import './Lesson.css';

export default function Lesson() {
  const { phaseSlug, lessonSlug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getLesson(phaseSlug, lessonSlug)
      .then(setLesson)
      .catch(console.error)
      .finally(() => setLoading(false));

    if (user) {
      api.getPhase(phaseSlug)
        .then((phase) => {
          const lessonData = phase.lessons?.find((l) => l.slug === lessonSlug);
          if (lessonData && phase.lessonProgress) {
            setCompleted(!!phase.lessonProgress[lessonData.id]);
          }
        })
        .catch(console.error);
    }
  }, [phaseSlug, lessonSlug, user]);

  const handleToggleComplete = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setActionLoading(true);
    try {
      if (completed) {
        await api.uncompleteLesson(phaseSlug, lessonSlug);
        setCompleted(false);
      } else {
        await api.completeLesson(phaseSlug, lessonSlug);
        setCompleted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading"><div className="spinner" /></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="page">
        <div className="container">
          <p>Aula não encontrada.</p>
          <Link to={`/fases/${phaseSlug}`}>Voltar à fase</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page lesson-page">
      <div className="container lesson-container">
        <div className="lesson-breadcrumb">
          <Link to="/fases">Trilha</Link>
          <span>/</span>
          <Link to={`/fases/${phaseSlug}`}>Fase {lesson.phase_number}</Link>
          <span>/</span>
          <span>{lesson.title}</span>
        </div>

        <VideoPlayer videos={lesson.videos} locked={lesson.videosLocked} />

        <article className="lesson-content card">
          <div className="lesson-header">
            <span className="badge badge-accent">Fase {lesson.phase_number} — {lesson.phase_title}</span>
            {lesson.type === 'project' && <span className="badge badge-success">Projeto</span>}
          </div>

          <div className="markdown-content">
            <ReactMarkdown>{lesson.content}</ReactMarkdown>
          </div>

          <div className="lesson-actions">
            {user ? (
              <button
                className={`btn ${completed ? 'btn-secondary' : 'btn-success'}`}
                onClick={handleToggleComplete}
                disabled={actionLoading}
              >
                {actionLoading
                  ? 'Salvando...'
                  : completed
                    ? '✓ Aula Concluída — Desmarcar'
                    : 'Marcar como Concluída'}
              </button>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Entre para salvar progresso
              </Link>
            )}
          </div>
        </article>

        <nav className="lesson-nav">
          {lesson.prev ? (
            <Link
              to={`/fases/${phaseSlug}/aulas/${lesson.prev.slug}`}
              className="lesson-nav-link lesson-nav-prev card"
            >
              <span className="lesson-nav-label">← Anterior</span>
              <span className="lesson-nav-title">{lesson.prev.title}</span>
            </Link>
          ) : (
            <div />
          )}
          {lesson.next ? (
            <Link
              to={`/fases/${phaseSlug}/aulas/${lesson.next.slug}`}
              className="lesson-nav-link lesson-nav-next card"
            >
              <span className="lesson-nav-label">Próxima →</span>
              <span className="lesson-nav-title">{lesson.next.title}</span>
            </Link>
          ) : (
            <Link to={`/fases/${phaseSlug}`} className="lesson-nav-link lesson-nav-next card">
              <span className="lesson-nav-label">Fase concluída →</span>
              <span className="lesson-nav-title">Voltar à Fase {lesson.phase_number}</span>
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
