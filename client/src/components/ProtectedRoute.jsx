import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import NavbarLoader from './NavbarLoader';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useUser();

  if (loading) {
    return <NavbarLoader />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}
