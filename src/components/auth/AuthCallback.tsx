import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Auth callback error:', error);
        navigate('/auth/login?error=callback_error');
        return;
      }

      if (data.session?.user) {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', data.session.user.id)
          .maybeSingle();

        if (roleData?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/account');
        }
      } else {
        navigate('/auth/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-teal mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;