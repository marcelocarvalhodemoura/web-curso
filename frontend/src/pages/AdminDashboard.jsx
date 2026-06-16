import { useEffect, useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import AdminUsers from '../components/AdminUsers';
import './AdminDashboard.css';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('progress');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    if (user?.role === 'admin' && activeTab === 'progress') {
      setLoading(true);
      api
        .getAdminStudents()
        .then(setData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, navigate, activeTab]);

  if (authLoading || (activeTab === 'progress' && loading)) {
    return (
      <div className="page">
        <div className="loading"><div className="spinner" /></div>
      </div>
    );
  }

  return (
    <div className="page admin-dashboard">
      <div className="container">
        <div className="page-header">
          <h1>Painel Admin</h1>
          <p>Gerencie alunos e usuários da plataforma</p>
        </div>

        <div className="admin-tabs">
          <button
            type="button"
            className={`admin-tab ${activeTab === 'progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('progress')}
          >
            Progresso dos Alunos
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Usuários
          </button>
        </div>

        {activeTab === 'users' ? (
          <AdminUsers />
        ) : !data ? (
          <div className="admin-empty card">
            <p>Não foi possível carregar os dados de progresso.</p>
          </div>
        ) : (
          <>
            <div className="admin-summary">
              <div className="admin-summary-card card">
                <span className="admin-summary-value">{data.summary.totalStudents}</span>
                <span className="admin-summary-label">Total de Alunos</span>
              </div>
              <div className="admin-summary-card card">
                <span className="admin-summary-value">{data.summary.activeStudents}</span>
                <span className="admin-summary-label">Alunos Ativos</span>
              </div>
              <div className="admin-summary-card card">
                <span className="admin-summary-value">{data.summary.avgProgress}%</span>
                <span className="admin-summary-label">Progresso Médio</span>
              </div>
            </div>

            {data.students.length === 0 ? (
              <div className="admin-empty card">
                <p>Nenhum aluno cadastrado ainda.</p>
              </div>
            ) : (
              <div className="admin-table card">
                <table>
                  <thead>
                    <tr>
                      <th>Aluno</th>
                      <th>Email</th>
                      <th>Cadastro</th>
                      <th>Progresso</th>
                      <th>Aulas</th>
                      <th>Fases</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.students.map((student) => (
                      <Fragment key={student.id}>
                        <tr
                          className={expandedId === student.id ? 'expanded' : ''}
                          onClick={() =>
                            setExpandedId(expandedId === student.id ? null : student.id)
                          }
                        >
                          <td className="admin-student-name">{student.name}</td>
                          <td>{student.email}</td>
                          <td>{formatDate(student.created_at)}</td>
                          <td>
                            <div className="admin-progress-cell">
                              <div className="progress-bar admin-progress-bar">
                                <div
                                  className="progress-bar-fill"
                                  style={{ width: `${student.progress.overallPercentage}%` }}
                                />
                              </div>
                              <span>{student.progress.overallPercentage}%</span>
                            </div>
                          </td>
                          <td>
                            {student.progress.completedLessons}/{student.progress.totalLessons}
                          </td>
                          <td>
                            {student.progress.completedPhases}/{student.progress.totalPhases}
                          </td>
                          <td className="admin-expand-icon">
                            {expandedId === student.id ? '▲' : '▼'}
                          </td>
                        </tr>
                        {expandedId === student.id && (
                          <tr className="admin-detail-row">
                            <td colSpan={7}>
                              <div className="admin-phase-grid">
                                {student.progress.phases.map((phase) => (
                                  <div key={phase.phaseId} className="admin-phase-item">
                                    <div className="admin-phase-header">
                                      <span className="phase-progress-number">
                                        Fase {phase.phaseNumber}
                                      </span>
                                      {phase.percentage === 100 && phase.total > 0 && (
                                        <span className="badge badge-success">Completa</span>
                                      )}
                                    </div>
                                    <h4>{phase.phaseTitle}</h4>
                                    <div className="phase-progress-info">
                                      <span>
                                        {phase.completed}/{phase.total} aulas
                                      </span>
                                      <span>{phase.percentage}%</span>
                                    </div>
                                    <div className="progress-bar">
                                      <div
                                        className="progress-bar-fill"
                                        style={{ width: `${phase.percentage}%` }}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
