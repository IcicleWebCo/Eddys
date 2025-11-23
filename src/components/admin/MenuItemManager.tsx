import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CreditCard as Edit2, Trash2, GripVertical, Plus, X, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Category {
  id: string;
  name: string;
}

interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number | null;
  seq: number;
}

interface MenuItemManagerProps {
  onSelectItem: (itemId: string) => void;
  onCategoriesRefresh?: number;
}

interface SortableMenuItemProps {
  item: MenuItem;
  onSelectItem: (itemId: string) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}

function SortableMenuItem({ item, onSelectItem, onEdit, onDelete }: SortableMenuItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-sm border p-4 flex items-center space-x-4 ${
        isDragging ? 'shadow-lg ring-2 ring-accent-orange opacity-50' : ''
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical className="text-gray-400" size={20} />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-800">{item.name}</h4>
          {item.price && (
            <span className="text-accent-orange font-semibold">
              ${item.price.toFixed(2)}
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onSelectItem(item.id)}
          className="text-gray-600 hover:text-accent-mint transition-colors p-2"
          title="Manage Options"
        >
          <ChevronRight size={18} />
        </button>
        <button
          onClick={() => onEdit(item)}
          className="text-gray-600 hover:text-primary-teal transition-colors p-2"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="text-gray-600 hover:text-red-600 transition-colors p-2"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export function MenuItemManager({ onSelectItem, onCategoriesRefresh }: MenuItemManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: ''
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (onCategoriesRefresh !== undefined && onCategoriesRefresh > 0) {
      fetchCategories();
    }
  }, [onCategoriesRefresh]);

  useEffect(() => {
    if (selectedCategory) {
      fetchMenuItems(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('category')
        .select('id, name')
        .order('seq', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
      if (data && data.length > 0 && !selectedCategory) {
        setSelectedCategory(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async (categoryId: string) => {
    try {
      const { data, error } = await supabase
        .from('menu_item')
        .select('*')
        .eq('category_id', categoryId)
        .order('seq', { ascending: true });

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = menuItems.findIndex((item) => item.id === active.id);
    const newIndex = menuItems.findIndex((item) => item.id === over.id);

    const updatedItems = arrayMove(menuItems, oldIndex, newIndex).map((item, index) => ({
      ...item,
      seq: index
    }));

    setMenuItems(updatedItems);

    try {
      for (const item of updatedItems) {
        await supabase
          .from('menu_item')
          .update({ seq: item.seq })
          .eq('id', item.id);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      if (selectedCategory) {
        fetchMenuItems(selectedCategory);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('menu_item')
          .update({
            name: formData.name,
            description: formData.description || null,
            price: formData.price ? parseFloat(formData.price) : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingItem.id);

        if (error) throw error;
      } else {
        const maxSeq = menuItems.length > 0 ? Math.max(...menuItems.map(i => i.seq)) : -1;

        const { error } = await supabase
          .from('menu_item')
          .insert({
            category_id: selectedCategory,
            name: formData.name,
            description: formData.description || null,
            price: formData.price ? parseFloat(formData.price) : null,
            seq: maxSeq + 1
          });

        if (error) throw error;
      }

      setFormData({ name: '', description: '', price: '' });
      setShowForm(false);
      setEditingItem(null);
      fetchMenuItems(selectedCategory);
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price?.toString() || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('menu_item')
        .delete()
        .eq('id', id);

      if (error) throw error;
      if (selectedCategory) {
        fetchMenuItems(selectedCategory);
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({ name: '', description: '', price: '' });
  };

  if (loading) {
    return <div className="text-center py-8">Loading menu items...</div>;
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-600">Please create a category first before adding menu items.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Category
        </label>
        <select
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Menu Items</h3>
        {!showForm && selectedCategory && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-accent-orange hover:bg-accent-red transition-colors text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>Add Item</span>
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-800">
              {editingItem ? 'Edit Menu Item' : 'New Menu Item'}
            </h4>
            <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-accent-orange hover:bg-accent-red transition-colors text-white px-6 py-2 rounded-lg"
              >
                {editingItem ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-200 hover:bg-gray-300 transition-colors text-gray-700 px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={menuItems.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {menuItems.map((item) => (
              <SortableMenuItem
                key={item.id}
                item={item}
                onSelectItem={onSelectItem}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {menuItems.length === 0 && !showForm && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600">No menu items in this category yet. Add your first item to get started.</p>
        </div>
      )}
    </div>
  );
}
