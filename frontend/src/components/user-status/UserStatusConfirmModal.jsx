import './UserStatus.css';

export default function UserStatusConfirmModal({ user, action, loading, onConfirm, onCancel }) {
  const isDeactivate = action === 'deactivate';

  return (
    <div className="user-status-modal-overlay" onClick={onCancel}>
      <div className="user-status-modal card" onClick={(e) => e.stopPropagation()}>
        <h3>{isDeactivate ? 'Desativar usuário' : 'Ativar usuário'}</h3>
        <p>
          {isDeactivate ? (
            <>
              Tem certeza que deseja desativar <strong>{user.name}</strong>?
              O usuário não poderá mais acessar a plataforma.
            </>
          ) : (
            <>
              Deseja reativar o acesso de <strong>{user.name}</strong>?
            </>
          )}
        </p>
        <div className="user-status-modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
          <button
            type="button"
            className={`btn ${isDeactivate ? 'user-status-deactivate' : 'user-status-activate'}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Salvando...' : isDeactivate ? 'Desativar' : 'Ativar'}
          </button>
        </div>
      </div>
    </div>
  );
}
