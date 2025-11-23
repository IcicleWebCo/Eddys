import { MapPin, Phone, Mail, Clock, MessageSquare, X, Facebook, Instagram } from 'lucide-react';
import { useState } from 'react';
import { useCompanyProfile } from '../hooks/useCompanyProfile';
import { supabase } from '../lib/supabase';

const Contact = () => {
  const { profile, loading } = useCompanyProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      const { error } = await supabase
        .from('messages')
        .insert([formData]);

      if (error) throw error;

      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting message:', error);
      setSubmitError('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatHours = (hours: any) => {
    if (!hours) return null;

    // Handle different possible formats
    if (typeof hours === 'string') {
      // Split by newlines and format each line
      return hours.split('\n').map((line: string) => {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) return line;
        const before = line.substring(0, colonIndex + 1);
        const after = line.substring(colonIndex + 1).trim();
        return { before, after };
      });
    }
    if (typeof hours === 'object') {
      // Convert object format to formatted array
      return Object.entries(hours).map(([day, time]) => ({
        before: `${day}:`,
        after: time
      }));
    }
    return null;
  };

  return (
    <section id="contact" className="min-h-screen bg-primary-dark py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contact <span className="text-accent-mint">Us</span>
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Ready for some delicious pizza and subs? Swing by, give us a ring for pick-up, or even send a message. We're always happy to chat and get your order ready!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
         

            <div className="flex items-start space-x-4">
              <div className="bg-accent-orange/10 rounded-full p-3 flex-shrink-0">
                <Phone className="text-accent-orange" size={24} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">Phone</h4>
                {loading ? (
                  <p className="text-white/80">Loading...</p>
                ) : profile?.phone_number ? (
                  <a
                    href={`tel:${profile.phone_number}`}
                    className="text-white/80 hover:text-accent-orange transition-colors"
                  >
                    {profile.phone_number}
                  </a>
                ) : (
                  <p className="text-white/80">(509) 888-0889</p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary-teal/10 rounded-full p-3 flex-shrink-0">
                <Mail className="text-primary-teal" size={24} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">Email</h4>
                {loading ? (
                  <p className="text-white/80">Loading...</p>
                ) : profile?.email ? (
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-white/80 hover:text-primary-teal transition-colors"
                  >
                    {profile.email}
                  </a>
                ) : (
                  <p className="text-white/80">info@eddyspizzaandsubs.com</p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-accent-mint/10 rounded-full p-3 flex-shrink-0">
                <MapPin className="text-accent-mint" size={24} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">Address</h4>
                <p className="text-white/80">
                  114 W Locust St<br />
                  Waterville, WA 98858
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-accent-mint/10 rounded-full p-3 flex-shrink-0">
                <Clock className="text-accent-mint" size={24} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">Hours</h4>
                <div className="text-white/80 space-y-1">
                  <div className="flex">
                    <span className="flex-shrink-0">Open Daily</span>
                    <span className="ml-2 text-right flex-grow">11:00 AM - 9:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Send Message Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-accent-orange to-accent-red hover:from-accent-red hover:to-accent-orange transition-all duration-300 text-white px-10 py-5 rounded-full font-bold text-xl shadow-2xl shadow-accent-orange/60 hover:shadow-2xl hover:shadow-accent-red/60 hover:scale-105 transform border-2 border-white/10"
            >
              <MessageSquare size={28} className="group-hover:rotate-12 transition-transform duration-300" />
              Send Us a Message
            </button>
          </div>

          <div className="flex flex-col items-center justify-start space-y-8 w-full">
            {/* Social Media Links */}
            {(profile?.facebook_url || profile?.instagram_url || profile?.tiktok_url) && (
              <div className="w-full max-w-2xl">
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                  {profile.facebook_url && (
                    <a
                      href={profile.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center gap-2 bg-accent-mint/10 hover:bg-accent-mint/20 transition-all duration-300 p-4 sm:p-6 rounded-xl border-2 border-accent-mint/30 hover:border-accent-mint hover:scale-105 transform flex-shrink-0"
                    >
                      <Facebook size={32} className="text-accent-mint group-hover:scale-110 transition-transform" />
                      <span className="text-white font-semibold text-sm sm:text-base">Facebook</span>
                    </a>
                  )}
                  {profile.instagram_url && (
                    <a
                      href={profile.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center gap-2 bg-accent-orange/10 hover:bg-accent-orange/20 transition-all duration-300 p-4 sm:p-6 rounded-xl border-2 border-accent-orange/30 hover:border-accent-orange hover:scale-105 transform flex-shrink-0"
                    >
                      <Instagram size={32} className="text-accent-orange group-hover:scale-110 transition-transform" />
                      <span className="text-white font-semibold text-sm sm:text-base">Instagram</span>
                    </a>
                  )}
                  {profile.tiktok_url && (
                    <a
                      href={profile.tiktok_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center gap-2 bg-primary-teal/10 hover:bg-primary-teal/20 transition-all duration-300 p-4 sm:p-6 rounded-xl border-2 border-primary-teal/30 hover:border-primary-teal hover:scale-105 transform flex-shrink-0"
                    >
                      <svg className="w-8 h-8 text-primary-teal group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                      </svg>
                      <span className="text-white font-semibold text-sm sm:text-base">TikTok</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-accent-mint/30 w-full max-w-sm">
              <img
                src="/toon.png"
                alt="Eddy's Pizza and Subs"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
            <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-accent-mint/30 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Send Us a Message</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>

              {submitSuccess && (
                <div className="mb-6 p-4 bg-accent-mint/10 border border-accent-mint/20 rounded-lg">
                  <p className="text-accent-mint">Thank you! Your message has been sent successfully.</p>
                </div>
              )}

              {submitError && (
                <div className="mb-6 p-4 bg-accent-red/10 border border-accent-red/20 rounded-lg">
                  <p className="text-accent-red">{submitError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:border-accent-mint focus:outline-none"
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:border-accent-mint focus:outline-none"
                      placeholder="Your Email"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 mb-2">Phone (Optional)</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:border-accent-mint focus:outline-none"
                      placeholder="Your Phone"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2">Subject (Optional)</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:border-accent-mint focus:outline-none"
                      placeholder="Subject"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:border-accent-mint focus:outline-none resize-none"
                    rows={4}
                    placeholder="Your message..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-accent-orange hover:bg-accent-red disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 text-white py-3 rounded-lg font-semibold"
                >
                  {submitting ? 'Sending..' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Contact;