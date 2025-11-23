import { useState, useEffect } from 'react';
import { supabase, CompanyProfile } from '../lib/supabase';

export function useCompanyProfile() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: profileError } = await supabase
        .from('company_profile')
        .select('*')
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      setProfile(data);
    } catch (err) {
      console.error('Error fetching company profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch company profile');
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, refetch: fetchProfile };
}