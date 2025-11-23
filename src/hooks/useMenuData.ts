import { useState, useEffect } from 'react';
import { supabase, Category, MenuItem, ItemOptions } from '../lib/supabase';

export interface MenuItemWithOptions extends MenuItem {
  options: ItemOptions[];
}

export interface CategoryWithItems extends Category {
  items: MenuItemWithOptions[];
}

export function useMenuData() {
  const [categories, setCategories] = useState<CategoryWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch categories ordered by seq
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('category')
        .select('*')
        .order('seq', { ascending: true });

      if (categoriesError) throw categoriesError;

      // Fetch menu items ordered by seq
      const { data: menuItemsData, error: menuItemsError } = await supabase
        .from('menu_item')
        .select('*')
        .order('seq', { ascending: true });

      if (menuItemsError) throw menuItemsError;

      // Fetch item options ordered by seq
      const { data: optionsData, error: optionsError } = await supabase
        .from('item_options')
        .select('*')
        .order('seq', { ascending: true });

      if (optionsError) throw optionsError;

      // Group options by menu item
      const optionsByMenuItem = (optionsData || []).reduce((acc, option) => {
        if (!acc[option.menu_item_id!]) {
          acc[option.menu_item_id!] = [];
        }
        acc[option.menu_item_id!].push(option);
        return acc;
      }, {} as Record<string, ItemOptions[]>);

      // Group menu items by category and add options
      const itemsByCategory = (menuItemsData || []).reduce((acc, item) => {
        if (!acc[item.category_id!]) {
          acc[item.category_id!] = [];
        }
        acc[item.category_id!].push({
          ...item,
          options: optionsByMenuItem[item.id] || []
        });
        return acc;
      }, {} as Record<string, MenuItemWithOptions[]>);

      // Combine categories with their items
      const categoriesWithItems: CategoryWithItems[] = (categoriesData || []).map(category => ({
        ...category,
        items: itemsByCategory[category.id] || []
      }));

      setCategories(categoriesWithItems);
    } catch (err) {
      console.error('Error fetching menu data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch menu data');
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, error, refetch: fetchMenuData };
}