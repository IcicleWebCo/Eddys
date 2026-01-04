import { useState } from 'react';
import { useMenuData } from '../hooks/useMenuData';
import { Loader2, AlertCircle, Pizza, Sandwich, UtensilsCrossed, IceCream } from 'lucide-react';

const categoryIcons: { [key: string]: any } = {
  pizza: Pizza,
  pizzas: Pizza,
  sub: Sandwich,
  subs: Sandwich,
  sandwich: Sandwich,
  sandwiches: Sandwich,
  appetizer: UtensilsCrossed,
  appetizers: UtensilsCrossed,
  dessert: IceCream,
  desserts: IceCream,
  drink: IceCream,
  drinks: IceCream,
};

const getCategoryIcon = (categoryName: string) => {
  const normalized = categoryName.toLowerCase();
  for (const [key, Icon] of Object.entries(categoryIcons)) {
    if (normalized.includes(key)) {
      return Icon;
    }
  }
  return UtensilsCrossed;
};

const Menu = () => {
  const { categories, loading, error } = useMenuData();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const displayedCategory = selectedCategory
    ? categories.find(cat => cat.id === selectedCategory)
    : categories[0];

  const displayedItems = displayedCategory?.items || [];

  if (loading) {
    return (
      <section id="menu" className="min-h-screen bg-primary-dark py-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-accent-orange mx-auto mb-4" />
          <p className="text-gray-300">Loading our delicious menu...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="menu" className="min-h-screen bg-primary-dark py-20 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-accent-red mx-auto mb-4" />
          <p className="text-gray-300">Failed to load menu. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="min-h-screen bg-primary-dark py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Menu
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Handcrafted Pizza, Hearty Subs, and More
          </p>
        </div>

        {categories.length > 0 && (
          <>
            <div className="mb-12">
              <div className="flex flex-wrap justify-center gap-2 md:gap-3 lg:gap-4">
                {categories.map((category) => {
                  const Icon = getCategoryIcon(category.name);
                  const isActive = selectedCategory === category.id || (!selectedCategory && category.id === categories[0]?.id);

                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center space-x-1.5 md:space-x-2 px-3 py-2 md:px-6 md:py-3 rounded-full font-semibold transition-all duration-300 text-sm md:text-base whitespace-nowrap ${
                        isActive
                          ? 'bg-accent-orange text-white shadow-lg shadow-accent-orange/30 scale-105'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white hover:scale-105'
                      }`}
                    >
                      <Icon size={16} className="md:hidden" />
                      <Icon size={20} className="hidden md:block" />
                      <span>{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {displayedCategory && displayedCategory.description && (
              <div className="mb-8">
                <div className="max-w-3xl mx-auto bg-gradient-to-r from-accent-mint/20 via-primary-teal/20 to-accent-mint/20 border-2 border-accent-mint/40 rounded-xl p-6 shadow-xl shadow-accent-mint/10">
                  <p className="text-lg text-center text-white leading-relaxed font-medium">
                    {displayedCategory.description}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {displayedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg px-4 py-3 hover:from-gray-800 hover:to-gray-700 transition-all duration-300 border-l-4 border-accent-orange hover:border-accent-red hover:shadow-lg hover:shadow-accent-orange/10 group"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-3 mb-1">
                        <h4 className="text-lg font-bold text-white group-hover:text-accent-orange transition-colors duration-300 truncate">
                          {item.name}
                        </h4>
                        {item.price && (
                          <span className="text-xl font-bold text-accent-orange whitespace-nowrap">
                            ${item.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <p className="text-gray-400 text-sm leading-snug line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      {item.options.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {item.options.map((option) => (
                            <span
                              key={option.id}
                              className="inline-flex items-center gap-1 text-xs bg-gray-800/50 text-gray-300 px-2 py-1 rounded-full border border-gray-700"
                            >
                              <span>{option.name}</span>
                              {option.price && option.price > 0 && (
                                <span className="text-accent-orange font-semibold">
                                  +${option.price.toFixed(2)}
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {categories.length === 0 && !loading && (
          <div className="text-center py-12 bg-gray-900 rounded-xl border-2 border-dashed border-gray-700">
            <p className="text-gray-400 text-lg">Our menu is being updated. Please check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Menu;