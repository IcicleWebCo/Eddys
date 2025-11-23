import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCompanyProfile } from '../hooks/useCompanyProfile';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, userRole } = useAuth();
  const { profile } = useCompanyProfile();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-primary-dark/95 backdrop-blur-sm z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-accent-orange">Eddy's Pizza & Subs</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button
                onClick={() => scrollToSection('hero')}
                className="text-white hover:text-accent-mint transition-colors duration-300 px-3 py-2 text-sm font-medium"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('menu')}
                className="text-white hover:text-accent-mint transition-colors duration-300 px-3 py-2 text-sm font-medium"
              >
                Menu
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-white hover:text-accent-mint transition-colors duration-300 px-3 py-2 text-sm font-medium"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-white hover:text-accent-mint transition-colors duration-300 px-3 py-2 text-sm font-medium"
              >
                Contact
              </button>
              {userRole?.role === 'admin' && (
                <>
                  {user ? (
                    <div className="flex items-center space-x-4">
                      <Link
                        to="/account"
                        className="text-white hover:text-accent-mint transition-colors duration-300 px-3 py-2 text-sm font-medium"
                      >
                        Account
                      </Link>
                      <Link
                        to="/admin"
                        className="text-white hover:text-accent-mint transition-colors duration-300 px-3 py-2 text-sm font-medium"
                      >
                        Admin
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="text-white hover:text-accent-mint transition-colors duration-300 px-3 py-2 text-sm font-medium"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/auth/login"
                      className="text-white hover:text-accent-mint transition-colors duration-300 px-3 py-2 text-sm font-medium"
                    >
                      Login
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Call to Order Button */}
          <div className="hidden md:block">
            <a
              href={`tel:${profile?.phone_number || '(509) 888-0889'}`}
              className="bg-accent-orange hover:bg-accent-red transition-colors duration-300 text-white px-6 py-2 rounded-full font-semibold flex items-center space-x-2"
            >
              <Phone size={18} />
              <span>Call to Order</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-accent-mint transition-colors duration-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary-dark/98 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-white hover:text-accent-mint block px-3 py-2 text-base font-medium w-full text-left transition-colors duration-300"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('menu')}
              className="text-white hover:text-accent-mint block px-3 py-2 text-base font-medium w-full text-left transition-colors duration-300"
            >
              Menu
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-white hover:text-accent-mint block px-3 py-2 text-base font-medium w-full text-left transition-colors duration-300"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-white hover:text-accent-mint block px-3 py-2 text-base font-medium w-full text-left transition-colors duration-300"
            >
              Contact
            </button>
            {userRole?.role === 'admin' && (
              <>
                {user ? (
                  <div className="space-y-1">
                    <Link
                      to="/account"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-white hover:text-accent-mint block px-3 py-2 text-base font-medium w-full text-left transition-colors duration-300"
                    >
                      Account
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="text-white hover:text-accent-mint block px-3 py-2 text-base font-medium w-full text-left transition-colors duration-300"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white hover:text-accent-mint block px-3 py-2 text-base font-medium w-full text-left transition-colors duration-300"
                  >
                    Login
                  </Link>
                )}
              </>
            )}
            <a
              href={`tel:${profile?.phone_number || '(509) 888-0889'}`}
              className="bg-accent-orange hover:bg-accent-red transition-colors duration-300 text-white px-6 py-2 rounded-full font-semibold flex items-center space-x-2 mt-4 mx-3"
            >
              <Phone size={18} />
              <span>Call to Order</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;