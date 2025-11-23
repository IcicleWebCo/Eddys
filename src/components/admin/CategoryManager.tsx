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
import { CreditCard as Edit2, Trash2, GripVertical, Plus, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Category {
  id: string;
  name: string;
  description: string | null;
  seq: number;
}

interface SortableItemProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

function SortableItem({ category, onEdit, onDelete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-sm border p-4 flex items-center space-x-4 ${
        isDragging ? 'shadow-lg ring-2 ring-primary-teal opacity-50' : ''
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
        <h4 className="font-semibold text-gray-800">{category.name}</h4>
        {category.description && (
          <p className="text-sm text-gray-600 mt-1">{category.description}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onEdit(category)}
          className="text-gray-600 hover:text-primary-teal transition-colors p-2"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={() => onDelete(category.id)}
          className="text-gray-600 hover:text-red-600 transition-colors p-2"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

interface CategoryManagerProps {
  onCategoryChange?: () => void;
}

export function CategoryManager({ onCategoryChange }: CategoryManagerProps = {}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('category')
        .select('*')
        .order('seq', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex((cat) => cat.id === active.id);
    const newIndex = categories.findIndex((cat) => cat.id === over.id);

    const updatedItems = arrayMove(categories, oldIndex, newIndex).map((item, index) => ({
      ...item,
      seq: index
    }));

    setCategories(updatedItems);

    try {
      for (const item of updatedItems) {
        await supabase
          .from('category')
          .update({ seq: item.seq })
          .eq('id', item.id);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      fetchCategories();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('category')
          .update({
            name: formData.name,
            description: formData.description || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingCategory.id);

        if (error) throw error;
      } else {
        const maxSeq = categories.length > 0 ? Math.max(...categories.map(c => c.seq)) : -1;

        const { error } = await supabase
          .from('category')
          .insert({
            name: formData.name,
            description: formData.description || null,
            seq: maxSeq + 1
          });

        if (error) throw error;
      }

      setFormData({ name: '', description: '' });
      setShowForm(false);
      setEditingCategory(null);
      fetchCategories();
      onCategoryChange?.();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? All menu items in this category will also be affected.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('category')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchCategories();
      onCategoryChange?.();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
  };

  if (loading) {
    return <div className="text-center py-8">Loading categories...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Categories</h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary-teal hover:bg-primary-dark transition-colors text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>Add Category</span>
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-800">
              {editingCategory ? 'Edit Category' : 'New Category'}
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

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-primary-teal hover:bg-primary-dark transition-colors text-white px-6 py-2 rounded-lg"
              >
                {editingCategory ? 'Update' : 'Create'}
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
          items={categories.map((cat) => cat.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {categories.map((category) => (
              <SortableItem
                key={category.id}
                category={category}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {categories.length === 0 && !showForm && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600">No categories yet. Create your first category to get started.</p>
        </div>
      )}
    </div>
  );
}
