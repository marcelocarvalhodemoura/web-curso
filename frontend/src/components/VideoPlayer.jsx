import { Link } from 'react-router-dom';
import './VideoPlayer.css';

function getEmbedUrl(youtubeId) {
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`;
}

export default function VideoPlayer({ videos, locked }) {
  if (locked) {
    return (
      <section className="lesson-videos card video-locked">
        <div className="video-locked-content">
          <span className="video-locked-icon">🔒</span>
          <h2>Vídeos exclusivos para alunos</h2>
          <p>Entre com sua conta de aluno para assistir aos vídeos desta aula.</p>
          <div className="video-locked-actions">
            <Link to="/login" className="btn btn-primary">Entrar</Link>
            <Link to="/register" className="btn btn-secondary">Criar conta</Link>
          </div>
        </div>
      </section>
    );
  }

  if (!videos?.length) return null;

  const [main, ...extras] = videos;

  return (
    <section className="lesson-videos card">
      <div className="lesson-videos-header">
        <h2>Vídeos recomendados</h2>
        <p>Assista em português para reforçar o conteúdo desta aula</p>
      </div>

      <div className="video-player-main">
        <div className="video-embed">
          <iframe
            src={getEmbedUrl(main.youtube_id)}
            title={main.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <div className="video-info">
          <h3>{main.title}</h3>
          <span className="video-channel">{main.channel}</span>
        </div>
      </div>

      {extras.length > 0 && (
        <div className="video-list">
          <h4>Mais vídeos sobre este tema</h4>
          <div className="video-list-grid">
            {extras.map((video) => (
              <a
                key={video.youtube_id}
                href={`https://www.youtube.com/watch?v=${video.youtube_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="video-list-item"
              >
                <div className="video-thumb">
                  <img
                    src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                    alt={video.title}
                    loading="lazy"
                  />
                  <span className="video-play-icon">▶</span>
                </div>
                <div className="video-list-info">
                  <strong>{video.title}</strong>
                  <span>{video.channel}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
