import { useState } from 'react';
import { User, Mail, Shield, Calendar, LogOut, Heart, Star, Gift } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Account = () => {
  const { user, userRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-dark to-primary-teal px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 rounded-full p-3">
                  <User className="text-white" size={32} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">My Account</h1>
                  <p className="text-white/80">Manage your account settings</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-8">
              {/* Welcome Message */}
              <div className="bg-gradient-to-r from-accent-mint/10 to-primary-teal/10 rounded-lg p-6 border border-accent-mint/20">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome back!</h2>
                <p className="text-gray-600">Thank you for your continued support! We're grateful to have you as part of the Tony's Pizzeria family.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* My Favorite Orders */}
                <div className="bg-white border rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Heart className="text-accent-red" size={24} />
                    <h2 className="text-xl font-semibold text-gray-800">My Favorite Orders</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800">Margherita Pizza</h3>
                        <p className="text-sm text-gray-600">Large • Extra cheese</p>
                      </div>
                      <button className="text-primary-teal hover:text-primary-dark text-sm font-medium">
                        Reorder
                      </button>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800">Pepperoni Supreme</h3>
                        <p className="text-sm text-gray-600">Medium • Thin crust</p>
                      </div>
                      <button className="text-primary-teal hover:text-primary-dark text-sm font-medium">
                        Reorder
                      </button>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800">Veggie Deluxe</h3>
                        <p className="text-sm text-gray-600">Large • Thick crust</p>
                      </div>
                      <button className="text-primary-teal hover:text-primary-dark text-sm font-medium">
                        Reorder
                      </button>
                    </div>
                  </div>
                </div>

                {/* Reward Points & Review Card */}
                <div className="space-y-6">
                  {/* Reward Points */}
                  <div className="bg-gradient-to-br from-accent-orange/10 to-accent-red/10 border border-accent-orange/20 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <Gift className="text-accent-orange" size={24} />
                      <h2 className="text-xl font-semibold text-gray-800">Reward Points</h2>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-accent-orange mb-2">125</p>
                      <p className="text-sm text-gray-600">Points available</p>
                      <button className="mt-3 bg-accent-orange hover:bg-accent-red transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium">
                        Redeem Points
                      </button>
                    </div>
                  </div>

                  {/* Google Review Card */}
                  <div className="bg-gradient-to-br from-primary-teal/10 to-accent-mint/10 border border-primary-teal/20 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <Star className="text-primary-teal" size={24} />
                      <h2 className="text-lg font-semibold text-gray-800">Love Our Pizza?</h2>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm">
                      Help other pizza lovers discover Tony's! Your review means the world to us.
                    </p>
                    <a
                      href="https://www.google.com/search?q=tonys+pizzeria+reviews"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-primary-teal hover:bg-primary-dark transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Leave a Google Review!
                    </a>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="bg-white border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h2>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Mail className="text-primary-teal" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Email Address</p>
                      <p className="font-medium text-gray-800">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Shield className="text-primary-teal" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Account Role</p>
                      <p className="font-medium text-gray-800 capitalize">
                        {userRole?.role?.replace('_', ' ') || 'Basic User'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="text-primary-teal" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Member Since</p>
                      <p className="font-medium text-gray-800">
                        {user?.created_at ? formatDate(user.created_at) : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;