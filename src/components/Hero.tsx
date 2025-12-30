import { Sparkles, Pizza, Sandwich } from 'lucide-react';

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const Hero = () => {
  return (
    <section
      id="hero"
      className="min-h-screen relative flex items-center justify-center pt-16 overflow-hidden"
      style={{
        backgroundImage: 'url(/logo.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/85 to-gray-900/90"></div>

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-mint rounded-full blur-2xl md:blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent-orange rounded-full blur-2xl md:blur-3xl animate-pulse delay-75"></div>
        <div className="absolute top-1/2 right-1/3 w-56 h-56 bg-accent-red rounded-full blur-2xl md:blur-3xl animate-pulse delay-150"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8 md:space-y-12">
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center justify-center gap-3 md:gap-4 mb-6 md:mb-8">
              <Pizza className="text-accent-orange animate-pulse" size={36} />
              <Sparkles className="text-accent-mint animate-pulse delay-75" size={24} />
              <Sandwich className="text-accent-orange animate-pulse delay-150" size={36} />
            </div>

            <h1 className="text-4xl md:text-7xl lg:text-7xl font-black text-white leading-tight mb-4 md:mb-6"
                style={{
                  fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                  textShadow: window.innerWidth < 768
                    ? '0 0 20px rgba(255, 255, 255, 0.4), 0 0 40px rgba(255, 255, 255, 0.5), 0 4px 8px rgba(0, 0, 0, 0.8)'
                    : '0 0 40px rgba(255, 255, 255, 0.5), 0 0 80px rgba(255, 255, 255, 0.6), 0 4px 8px rgba(0, 0, 0, 0.8)',
                  letterSpacing: '0.08em'
                }}>
              THE NEIGHBORHOOD'S
            </h1>

            <div className="text-5xl md:text-8xl lg:text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-orange via-accent-red to-accent-orange animate-gradient-x mb-6 md:mb-8"
                 style={{
                   fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                   textShadow: window.innerWidth < 768
                     ? '0 0 30px rgba(255, 107, 53, 1), 0 0 60px rgba(255, 107, 53, 0.5), 0 0 90px rgba(255, 107, 53, 0.6)'
                     : '0 0 60px rgba(255, 107, 53, 1), 0 0 120px rgba(255, 107, 53, 0.5), 0 0 180px rgba(255, 107, 53, 0.6)',
                   letterSpacing: '0.1em',
                   WebkitTextStroke: window.innerWidth < 768 ? '1px rgba(255, 107, 53, 0.5)' : '2px rgba(255, 107, 53, 0.5)',
                   lineHeight: '0.9'
                 }}>
              BEST
            </div>

            <div className="flex items-center justify-center gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="h-1 w-24 md:w-32 bg-gradient-to-r from-transparent via-accent-mint to-transparent"></div>
              <Sparkles className="text-accent-mint animate-pulse" size={24} />
              <div className="h-1 w-24 md:w-32 bg-gradient-to-r from-transparent via-accent-mint to-transparent"></div>
            </div>

            <h2 className="text-3xl md:text-6xl lg:text-7xl font-black text-accent-mint mb-6 md:mb-8"
                style={{
                  fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                  textShadow: window.innerWidth < 768
                    ? '0 0 20px rgba(132, 255, 214, 1), 0 0 40px rgba(132, 255, 214, 0.5), 0 0 60px rgba(132, 255, 214, 0.6), 0 0 80px rgba(132, 255, 214, 0.4)'
                    : '0 0 40px rgba(132, 255, 214, 1), 0 0 80px rgba(132, 255, 214, 0.5), 0 0 120px rgba(132, 255, 214, 0.6), 0 0 160px rgba(132, 255, 214, 0.4)',
                  letterSpacing: '0.12em',
                  WebkitTextStroke: window.innerWidth < 768 ? '1px rgba(132, 255, 214, 0.3)' : '2px rgba(132, 255, 214, 0.3)'
                }}>
              One Bite & You're Family
            </h2>
          </div>

          <p className="text-xl md:text-3xl text-white/95 max-w-4xl mx-auto font-bold tracking-wide"
             style={{
               fontFamily: "'Oswald', sans-serif",
               textShadow: window.innerWidth < 768
                 ? '0 0 10px rgba(255, 255, 255, 0.5), 0 2px 4px rgba(0, 0, 0, 0.8)'
                 : '0 0 20px rgba(255, 255, 255, 0.6), 0 2px 4px rgba(0, 0, 0, 0.8)',
               letterSpacing: '0.05em'
             }}>
            YOUR NEW FAVORITE SPOT FOR HANDCRAFTED PIZZAS & SUBS
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;