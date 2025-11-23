import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, UserRole } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        (async () => {
          setUser(session?.user ?? null);
          if (session?.user) {
            await fetchUserRole(session.user.id);
          } else {
            setUserRole(null);
            setLoading(false);
          }
        })();
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
      } else {
        setUserRole(data);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (!error && data.user) {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', data.user.id)
        .maybeSingle();

      return { data, error, userRole: roleData };
    }

    return { data, error, userRole: null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });
    return { data, error };
  };

  const updatePassword = async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password
    });
    return { data, error };
  };

  const isAdmin = userRole?.role === 'admin';
  const isAuthenticated = !!user;

  return {
    user,
    userRole,
    loading,
    isAdmin,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword
  };
}