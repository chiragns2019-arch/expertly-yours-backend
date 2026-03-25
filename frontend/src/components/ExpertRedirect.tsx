import { Navigate, useParams } from 'react-router';

export function ExpertRedirect() {
  const { id } = useParams();
  return <Navigate to={`/profile/${id}`} replace />;
}
