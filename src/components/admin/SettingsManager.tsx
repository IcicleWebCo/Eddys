import { useState, useEffect } from 'react';
import { Save, X, Copy, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { BusinessHours, DAYS_OF_WEEK, DEFAULT_HOURS, validateHours } from '../../utils/hoursUtils';

export function SettingsManager() {
  const [hours, setHours] = useState<BusinessHours[]>(DEFAULT_HOURS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('company_profile')
        .select('*')
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (data) {
        setProfileId(data.id);
        if (data.hours_of_operation && Array.isArray(data.hours_of_operation)) {
          setHours(data.hours_of_operation);
        }
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleHoursChange = (index: number, field: keyof BusinessHours, value: string | boolean) => {
    const newHours = [...hours];
    newHours[index] = { ...newHours[index], [field]: value };
    setHours(newHours);
  };

  const handleToggleClosed = (index: number) => {
    const newHours = [...hours];
    newHours[index] = { ...newHours[index], is_closed: !newHours[index].is_closed };
    setHours(newHours);
  };

  const handleCopyToAll = (index: number) => {
    const sourceDay = hours[index];
    const newHours = hours.map(day => ({
      ...day,
      open_time: sourceDay.open_time,
      close_time: sourceDay.close_time,
      is_closed: sourceDay.is_closed
    }));
    setHours(newHours);
  };

  const handleSave = async () => {
    const validationError = validateHours(hours);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      if (profileId) {
        const { error: updateError } = await supabase
          .from('company_profile')
          .update({ hours_of_operation: hours, updated_at: new Date().toISOString() })
          .eq('id', profileId);

        if (updateError) throw updateError;
      } else {
        const { data, error: insertError } = await supabase
          .from('company_profile')
          .insert([{ hours_of_operation: hours }])
          .select()
          .single();

        if (insertError) throw insertError;
        if (data) setProfileId(data.id);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    fetchSettings();
    setError(null);
    setSuccess(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <p className="text-gray-600">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Clock className="text-primary-teal" size={24} />
            <h3 className="text-lg font-semibold text-gray-800">Business Hours</h3>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">Settings saved successfully!</p>
          </div>
        )}

        <div className="space-y-3">
          {hours.map((day, index) => (
            <div
              key={day.day}
              className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border ${
                day.is_closed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between sm:justify-start sm:w-32">
                <span className="font-medium text-gray-700">{day.day}</span>
                <button
                  onClick={() => handleCopyToAll(index)}
                  className="sm:hidden text-gray-400 hover:text-primary-teal transition-colors p-1"
                  title="Copy to all days"
                >
                  <Copy size={16} />
                </button>
              </div>

              <div className="flex items-center space-x-3 flex-1">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={day.is_closed}
                    onChange={() => handleToggleClosed(index)}
                    className="w-4 h-4 text-primary-teal border-gray-300 rounded focus:ring-primary-teal"
                  />
                  <span className="text-sm text-gray-600">Closed</span>
                </label>

                {!day.is_closed && (
                  <>
                    <input
                      type="time"
                      value={day.open_time}
                      onChange={(e) => handleHoursChange(index, 'open_time', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={day.close_time}
                      onChange={(e) => handleHoursChange(index, 'close_time', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                    />
                  </>
                )}
              </div>

              <button
                onClick={() => handleCopyToAll(index)}
                className="hidden sm:block text-gray-400 hover:text-primary-teal transition-colors p-2"
                title="Copy to all days"
              >
                <Copy size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
          <button
            onClick={handleReset}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <X size={18} />
            <span>Reset</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-2 bg-primary-teal hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <Save size={18} />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
