import { useState, useEffect } from 'react';
import { Settings, Users, Menu as MenuIcon, BarChart3, Plus, Home, CircleUser as UserCircle, MessageSquare, Trash2, Mail, Phone, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { CategoryManager } from '../components/admin/CategoryManager';
import { MenuItemManager } from '../components/admin/MenuItemManager';
import { ItemOptionsManager } from '../components/admin/ItemOptionsManager';

const Admin = () => {
  const { user, userRole } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(null);
  const [categoryRefreshTrigger, setCategoryRefreshTrigger] = useState(0);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCategories: 0,
    totalMenuItems: 0,
    totalMessages: 0
  });
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab !== 'menu') {
      setSelectedMenuItem(null);
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const { count: userCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true });

      const { count: categoryCount } = await supabase
        .from('category')
        .select('*', { count: 'exact', head: true });

      const { count: menuItemCount } = await supabase
        .from('menu_item')
        .select('*', { count: 'exact', head: true });

      const { count: messageCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: userCount || 0,
        totalCategories: categoryCount || 0,
        totalMenuItems: menuItemCount || 0,
        totalMessages: messageCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'menu', name: 'Menu', icon: MenuIcon },
    { id: 'messages', name: 'Messages', icon: MessageSquare },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchMessages();
      fetchStats();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'messages') {
      fetchMessages();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.email}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-teal transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <Home size={18} />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <Link
                to="/account"
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-teal transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <UserCircle size={18} />
                <span className="hidden sm:inline">Account</span>
              </Link>
              <span className="bg-accent-orange/10 text-accent-orange px-3 py-1 rounded-full text-sm font-medium">
                {userRole?.role?.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-teal text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Dashboard Overview</h2>
                
                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
                      </div>
                      <Users className="text-primary-teal" size={32} />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Menu Categories</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.totalCategories}</p>
                      </div>
                      <MenuIcon className="text-accent-orange" size={32} />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Menu Items</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.totalMenuItems}</p>
                      </div>
                      <Plus className="text-accent-mint" size={32} />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Messages</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.totalMessages}</p>
                      </div>
                      <MessageSquare className="text-primary-teal" size={32} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">User Messages</h2>

                {loadingMessages ? (
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <p className="text-gray-600">Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <p className="text-gray-600">No messages yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <h3 className="text-lg font-semibold text-gray-800">{message.name}</h3>
                              {message.subject && (
                                <span className="text-sm text-gray-500">- {message.subject}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              {message.email && (
                                <div className="flex items-center gap-1">
                                  <Mail size={14} />
                                  <a href={`mailto:${message.email}`} className="hover:text-primary-teal">
                                    {message.email}
                                  </a>
                                </div>
                              )}
                              {message.phone && (
                                <div className="flex items-center gap-1">
                                  <Phone size={14} />
                                  <a href={`tel:${message.phone}`} className="hover:text-primary-teal">
                                    {message.phone}
                                  </a>
                                </div>
                              )}
                              {message.created_at && (
                                <div className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  <span>{new Date(message.created_at).toLocaleString()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteMessage(message.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-2"
                            title="Delete message"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
                  <button className="bg-primary-teal hover:bg-primary-dark transition-colors text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                    <Plus size={18} />
                    <span>Add User</span>
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <p className="text-gray-600">User management interface coming soon...</p>
                </div>
              </div>
            )}

            {activeTab === 'menu' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Menu Management</h2>

                {selectedMenuItem ? (
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <ItemOptionsManager
                      menuItemId={selectedMenuItem}
                      onBack={() => setSelectedMenuItem(null)}
                    />
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <CategoryManager
                        onCategoryChange={() => setCategoryRefreshTrigger(prev => prev + 1)}
                      />
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <MenuItemManager
                        onSelectItem={setSelectedMenuItem}
                        onCategoriesRefresh={categoryRefreshTrigger}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Restaurant Settings</h2>
                
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <p className="text-gray-600">Settings interface coming soon...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;