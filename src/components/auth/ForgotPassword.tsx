import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await resetPassword(email);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-teal to-primary-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-accent-mint mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Check Your Email</h2>
            <p className="text-white/80 mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-white/60 text-sm mb-8">
              Please check your email and follow the instructions to reset your password.
            </p>
            <Link
              to="/auth/login"
              className="inline-flex items-center space-x-2 bg-accent-orange hover:bg-accent-red transition-colors duration-300 text-white px-6 py-3 rounded-lg font-semibold"
            >
              <ArrowLeft size={20} />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-teal to-primary-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
          <p className="text-white/80">Enter your email to receive a reset link</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 shadow-xl">
          {error && (
            <div className="mb-6 p-4 bg-accent-red/10 border border-accent-red/20 rounded-lg flex items-center space-x-2">
              <AlertCircle className="text-accent-red" size={20} />
              <p className="text-accent-red text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:border-accent-mint focus:outline-none focus:ring-2 focus:ring-accent-mint/20"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-orange hover:bg-accent-red disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 text-white py-3 rounded-lg font-semibold"
            >
              {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/auth/login"
              className="inline-flex items-center space-x-2 text-accent-mint hover:text-accent-mint/80 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;