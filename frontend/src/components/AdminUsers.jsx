import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import './AdminUsers.css';

const EMPTY_FORM = { name: '', email: '', password: '', role: 'student' };

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

function roleLabel(role) {
  return role === 'admin' ? 'Administrador' : 'Aluno';
}

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const loadUsers = () => {
    setLoading(true);
    api
      .getAdminUsers()
      .then((data) => setUsers(data.users))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: '', role: user.role });
    setFormError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingUser(null);
    setForm(EMPTY_FORM);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);

    try {
      if (editingUser) {
        const payload = { name: form.name, email: form.email, role: form.role };
        if (form.password) payload.password = form.password;
        await api.updateAdminUser(editingUser.id, payload);
      } else {
        await api.createAdminUser(form);
      }
      closeModal();
      loadUsers();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (user) => {
    setError('');
    setTogglingId(user.id);
    try {
      await api.updateAdminUser(user.id, { active: !user.active });
      loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setTogglingId(null);
    }
  };

  const activeCount = users.filter((u) => u.active).length;
  const inactiveCount = users.length - activeCount;

  const handleDelete = async (userId) => {
    try {
      await api.deleteAdminUser(userId);
      setDeleteConfirm(null);
      loadUsers();
    } catch (err) {
      setError(err.message);
      setDeleteConfirm(null);
    }
  };

  if (loading) {
    return (
      <div className="loading"><div className="spinner" /></div>
    );
  }

  return (
    <div className="admin-users">
      {error && (
        <div className="admin-users-alert">
          {error}
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setError('')}>
            Fechar
          </button>
        </div>
      )}

      <div className="admin-users-header">
        <div>
          <h2>Gerenciamento de Usuários</h2>
          <p>
            {activeCount} ativo{activeCount !== 1 ? 's' : ''}
            {inactiveCount > 0 && ` · ${inactiveCount} inativo${inactiveCount !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreateModal}>
          Novo Usuário
        </button>
      </div>

      {users.length === 0 ? (
        <div className="admin-empty card">
          <p>Nenhum usuário cadastrado.</p>
        </div>
      ) : (
        <div className="admin-table card admin-users-table">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Cadastro</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className={!user.active ? 'admin-users-inactive' : ''}>
                  <td className="admin-student-name">
                    {user.name}
                    {user.id === currentUser?.id && (
                      <span className="admin-users-you"> (você)</span>
                    )}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${user.role === 'admin' ? 'badge-accent' : 'badge-success'}`}>
                      {roleLabel(user.role)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${user.active ? 'badge-success' : 'badge-muted'}`}>
                      {user.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>{formatDate(user.created_at)}</td>
                  <td>
                    <div className="admin-users-actions">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => openEditModal(user)}
                      >
                        Editar
                      </button>
                      {user.id !== currentUser?.id && (
                        <button
                          type="button"
                          className={`btn btn-sm ${user.active ? 'admin-users-deactivate' : 'admin-users-activate'}`}
                          onClick={() => handleToggleActive(user)}
                          disabled={togglingId === user.id}
                        >
                          {togglingId === user.id
                            ? '...'
                            : user.active
                              ? 'Desativar'
                              : 'Ativar'}
                        </button>
                      )}
                      {user.id !== currentUser?.id && (
                        <button
                          type="button"
                          className="btn btn-sm admin-users-delete"
                          onClick={() => setDeleteConfirm(user)}
                        >
                          Excluir
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="admin-users-modal-overlay" onClick={closeModal}>
          <div className="admin-users-modal card" onClick={(e) => e.stopPropagation()}>
            <h3>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h3>

            <form onSubmit={handleSubmit}>
              {formError && <div className="form-error auth-error">{formError}</div>}

              <div className="form-group">
                <label htmlFor="user-name">Nome</label>
                <input
                  id="user-name"
                  type="text"
                  className="form-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="user-email">Email</label>
                <input
                  id="user-email"
                  type="email"
                  className="form-input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="user-password">
                  Senha{editingUser && ' (deixe em branco para manter)'}
                </label>
                <input
                  id="user-password"
                  type="password"
                  className="form-input"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder={editingUser ? '••••••' : 'Mínimo 6 caracteres'}
                  minLength={editingUser ? undefined : 6}
                  required={!editingUser}
                />
              </div>

              <div className="form-group">
                <label htmlFor="user-role">Tipo</label>
                <select
                  id="user-role"
                  className="form-input"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="student">Aluno</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="admin-users-modal-actions">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Salvando...' : editingUser ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="admin-users-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-users-modal card admin-users-confirm" onClick={(e) => e.stopPropagation()}>
            <h3>Excluir usuário</h3>
            <p>
              Tem certeza que deseja excluir <strong>{deleteConfirm.name}</strong>?
              Esta ação não pode ser desfeita.
            </p>
            <div className="admin-users-modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>
                Cancelar
              </button>
              <button
                type="button"
                className="btn admin-users-delete"
                onClick={() => handleDelete(deleteConfirm.id)}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
