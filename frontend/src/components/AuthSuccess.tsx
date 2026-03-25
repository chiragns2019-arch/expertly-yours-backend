import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userId = params.get('userId');
    const name = params.get('name');
    const role = params.get('role');

    if (token) {
      // Store in the same format the rest of the app expects
      const user = {
        id: userId,
        name: name,
        role: role,
        token: token,
      };
      localStorage.setItem('expertly_yours_user', JSON.stringify(user));
      navigate('/dashboard', { replace: true });
    } else {
      // No token — send to login with error
      navigate('/login?error=auth_failed', { replace: true });
    }
  }, [navigate]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p>Signing you in...</p>
    </div>
  );
}
