import { useState } from 'react';
import { api } from '../../services/api';
import UserStatusConfirmModal from './UserStatusConfirmModal';
import './UserStatus.css';

export default function UserStatusToggle({ user, disabled = false, onSuccess, onError }) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const action = user.active ? 'deactivate' : 'activate';

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await api.updateAdminUser(user.id, { active: !user.active });
      setShowConfirm(false);
      onSuccess?.();
    } catch (err) {
      onError?.(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (disabled) return null;

  return (
    <>
      <button
        type="button"
        className={`btn btn-sm ${user.active ? 'user-status-deactivate' : 'user-status-activate'}`}
        onClick={() => setShowConfirm(true)}
        disabled={loading}
      >
        {user.active ? 'Desativar' : 'Ativar'}
      </button>

      {showConfirm && (
        <UserStatusConfirmModal
          user={user}
          action={action}
          loading={loading}
          onConfirm={handleConfirm}
          onCancel={() => !loading && setShowConfirm(false)}
        />
      )}
    </>
  );
}
