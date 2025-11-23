import { ChefHat, Heart, Star, Sparkles } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-accent-mint rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent-orange rounded-full blur-3xl animate-pulse delay-75"></div>
        <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-primary-teal rounded-full blur-3xl animate-pulse delay-150"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block mb-8">
            <h2 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-orange via-accent-red to-accent-orange animate-gradient-x mb-2"
                style={{
                  fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                  textShadow: '0 0 20px rgba(255, 107, 53, 0.8), 0 0 40px rgba(255, 107, 53, 0.6), 0 0 60px rgba(255, 107, 53, 0.4)',
                  letterSpacing: '0.1em'
                }}>
              ABOUT
            </h2>
            <div className="text-7xl md:text-9xl font-black text-accent-mint mb-4"
                 style={{
                   fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                   textShadow: '0 0 30px rgba(132, 255, 214, 1), 0 0 60px rgba(132, 255, 214, 0.8), 0 0 90px rgba(132, 255, 214, 0.6), 0 0 120px rgba(132, 255, 214, 0.4)',
                   letterSpacing: '0.15em',
                   WebkitTextStroke: '2px rgba(132, 255, 214, 0.5)'
                 }}>
              EDDY'S
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-accent-orange to-transparent"></div>
            <Sparkles className="text-accent-mint animate-pulse" size={24} />
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-accent-orange to-transparent"></div>
          </div>
          <p className="text-xl md:text-2xl text-accent-mint/90 max-w-3xl mx-auto font-semibold tracking-wide"
             style={{ fontFamily: "'Oswald', sans-serif", textShadow: '0 0 10px rgba(132, 255, 214, 0.5)' }}>
            From Transplants to Toppings
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-2xl border-4 border-accent-orange/30 backdrop-blur-sm">
            <h3 className="text-4xl md:text-5xl font-black text-accent-orange mb-6"
                style={{
                  fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                  textShadow: '0 0 20px rgba(255, 107, 53, 0.8), 0 0 40px rgba(255, 107, 53, 0.5)',
                  letterSpacing: '0.08em'
                }}>
              OUR STORY
            </h3>
            <p className="text-white/90 leading-relaxed text-lg" style={{ fontFamily: "'Roboto', sans-serif" }}>
              We didn't grow up in Waterville, but we fell for it—<span className="text-accent-mint font-bold">hard</span>. So we did what any self-respecting pizza-loving transplants would do: we opened a shop. Eddy's Pizza & Subs is our delicious excuse to meet the neighbors, feed the town, and sneak our way into your weekly cravings.
            </p>
            <p className="text-white/90 leading-relaxed text-lg" style={{ fontFamily: "'Roboto', sans-serif" }}>
              We're <span className="text-accent-orange font-bold">family-run</span>, <span className="text-accent-orange font-bold">flavor obsessed</span>, and just sentimental enough to believe that melted cheese can build lifelong friendships.
            </p>
            <div className="bg-accent-red/20 border-l-4 border-accent-red p-4 rounded-r-lg">
              <p className="text-white font-bold text-xl italic">
                One bite and you're family. And yes, we mean that literally—there may be hugs.
              </p>
            </div>
          </div>
          <div className="h-96 rounded-2xl flex items-center justify-center relative border-4 border-accent-mint/50 overflow-hidden group bg-gray-900"
               style={{
                 backgroundImage: 'url(/logo.jpg)',
                 backgroundSize: 'contain',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat'
               }}>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl border-2 border-accent-mint/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 hover:border-accent-mint/60">
            <div className="bg-gradient-to-br from-accent-mint to-primary-teal rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent-mint/50">
              <ChefHat className="text-white" size={40} />
            </div>
            <h4 className="text-2xl font-black text-accent-mint mb-3"
                style={{
                  fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                  letterSpacing: '0.05em',
                  textShadow: '0 0 15px rgba(132, 255, 214, 0.5)'
                }}>
              A SLICE OF THE COMMUNITY
            </h4>
            <p className="text-white/80 leading-relaxed">Proudly serving our neighbors with a commitment to quality and service that makes us more than just a restaurant.</p>
          </div>

          <div className="text-center p-8 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl border-2 border-accent-orange/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 hover:border-accent-orange/60">
            <div className="bg-gradient-to-br from-accent-orange to-accent-red rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent-orange/50">
              <Heart className="text-white" size={40} />
            </div>
            <h4 className="text-2xl font-black text-accent-orange mb-3"
                style={{
                  fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                  letterSpacing: '0.05em',
                  textShadow: '0 0 15px rgba(255, 107, 53, 0.5)'
                }}>
              ONLY THE GOOD STUFF
            </h4>
            <p className="text-white/80 leading-relaxed">Our signature dough is prepared in-house every single day, giving our pizza crust the perfect blend of crispiness and chew.</p>
          </div>

          <div className="text-center p-8 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl border-2 border-accent-mint/30 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 hover:border-accent-mint/60">
            <div className="bg-gradient-to-br from-accent-mint to-primary-teal rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent-mint/50">
              <Star className="text-white" size={40} />
            </div>
            <h4 className="text-2xl font-black text-accent-mint mb-3"
                style={{
                  fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                  letterSpacing: '0.05em',
                  textShadow: '0 0 15px rgba(132, 255, 214, 0.5)'
                }}>
              FAST, FRIENDLY & FRESH
            </h4>
            <p className="text-white/80 leading-relaxed">Get your order made just the way you like it, served with a smile whether you're dining in or taking it to go.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;