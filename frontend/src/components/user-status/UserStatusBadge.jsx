import './UserStatus.css';

export default function UserStatusBadge({ active }) {
  return (
    <span className={`user-status-badge badge ${active ? 'badge-success' : 'badge-muted'}`}>
      {active ? 'Ativo' : 'Inativo'}
    </span>
  );
}
