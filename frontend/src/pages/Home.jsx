import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const phases = [
  { num: 1, title: 'Alfabetização Digital', weeks: 4 },
  { num: 2, title: 'Introdução à Programação', weeks: 6 },
  { num: 3, title: 'Ferramentas do Dev', weeks: 2 },
  { num: 4, title: 'Web Básico', weeks: 8 },
  { num: 5, title: 'Banco de Dados', weeks: 4 },
  { num: 6, title: 'Backend', weeks: 8 },
  { num: 7, title: 'Frontend Moderno', weeks: 8 },
  { num: 8, title: 'Qualidade', weeks: 4 },
  { num: 9, title: 'DevOps', weeks: 4 },
  { num: 10, title: 'Arquitetura', weeks: 4 },
];

export default function Home() {
  const { user } = useAuth();
  const totalWeeks = phases.reduce((sum, p) => sum + p.weeks, 4);

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-badge">Trilha completa para iniciantes</div>
          <h1 className="hero-title">
            Do zero ao<br />
            <span className="gradient-text">Desenvolvedor Júnior</span>
          </h1>
          <p className="hero-subtitle">
            Uma jornada estruturada em 10 fases que vai da alfabetização digital
            até arquitetura de software. Estude no seu ritmo com projetos práticos.
          </p>
          <div className="hero-actions">
            <Link to={user ? '/fases' : '/register'} className="btn btn-primary btn-lg">
              {user ? 'Continuar Trilha' : 'Começar Agora'}
            </Link>
            <Link to="/fases" className="btn btn-secondary btn-lg">
              Ver Fases
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">10</span>
              <span className="stat-label">Fases</span>
            </div>
            <div className="stat">
              <span className="stat-value">{totalWeeks}</span>
              <span className="stat-label">Semanas</span>
            </div>
            <div className="stat">
              <span className="stat-value">50+</span>
              <span className="stat-label">Aulas</span>
            </div>
            <div className="stat">
              <span className="stat-value">6</span>
              <span className="stat-label">Projetos</span>
            </div>
          </div>
        </div>
      </section>

      <section className="phases-preview">
        <div className="container">
          <h2 className="section-title">A Trilha</h2>
          <p className="section-subtitle">
            Cada fase tem objetivos claros, exercícios práticos e resultado esperado
          </p>
          <div className="phases-timeline">
            {phases.map((phase) => (
              <div key={phase.num} className="timeline-item">
                <div className="timeline-number">{phase.num}</div>
                <div className="timeline-content">
                  <h3>{phase.title}</h3>
                  <span className="timeline-weeks">{phase.weeks} semanas</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Por que esta trilha?</h2>
          <div className="grid-3">
            <div className="feature-card card">
              <div className="feature-icon">🎯</div>
              <h3>Progressão gradual</h3>
              <p>Começa pela lógica e conceitos, não por uma linguagem. Ideal para quem nunca programou.</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">🛠️</div>
              <h3>Projetos reais</h3>
              <p>Cada fase culmina em um projeto prático: site pessoal, API de tarefas, deploy em produção.</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">📊</div>
              <h3>Acompanhamento</h3>
              <p>Marque aulas como concluídas e acompanhe seu progresso em cada fase da trilha.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Pronto para começar sua jornada?</h2>
          <p>Estimativa de 10 a 14 meses estudando 1-2h por dia</p>
          <Link to={user ? '/fases' : '/register'} className="btn btn-primary btn-lg">
            {user ? 'Acessar Trilha' : 'Criar Conta Grátis'}
          </Link>
        </div>
      </section>
    </div>
  );
}
