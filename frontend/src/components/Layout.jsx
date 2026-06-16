import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            <span className="logo-icon">{'</>'}</span>
            <span className="logo-text">DevTrail</span>
          </Link>

          <nav className="nav">
            <Link to="/fases">Trilha</Link>
            {user ? (
              <>
                {isAdmin ? (
                  <Link to="/admin">Painel Admin</Link>
                ) : (
                  <Link to="/dashboard">Meu Progresso</Link>
                )}
                <span className="nav-user">{user.name}</span>
                <button className="btn btn-ghost" onClick={handleLogout}>
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Entrar</Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Começar
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <p>DevTrail — Trilha de Desenvolvimento de Software</p>
          <p className="footer-sub">Do zero ao desenvolvedor júnior em 10 fases</p>
        </div>
      </footer>
    </>
  );
}
