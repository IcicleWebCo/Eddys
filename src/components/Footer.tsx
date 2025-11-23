import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Service {
  id: number;
  name: string;
  created_at: string;
}

const Footer = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name', { ascending: true });
      console.log(data);

      if (!error && data) {
        setServices(data);
      }
    };

    fetchServices();
  }, []);

  return (
    <footer className="bg-primary-dark border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-accent-mint">Eddy's Pizza & Subs</h3>
            <p className="text-white/80 leading-relaxed">
              Small Mom and Pop shop with big city taste! One Bite and you're family. ❤️🍕
            </p>
            <p className="text-white/80 leading-relaxed">
              Proudly serving Waterville, WA
            </p>
          </div>
          
          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Services</h4>
            <div className="space-y-2">
              {services.length > 0 ? (
                services.map((service) => (
                  <p key={service.id} className="text-white/80">{service.name}</p>
                ))
              ) : (
                <>
                  <p className="text-white/80">Dine-in</p>
                  <p className="text-white/80">Takeout</p>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-white/60">
            &copy; 2025 Eddy's Pizza & Subs. All rights reserved. Made with ❤️ for pizza lovers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;