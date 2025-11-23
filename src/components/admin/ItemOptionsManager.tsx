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
import { CreditCard as Edit2, Trash2, GripVertical, Plus, X, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ItemOption {
  id: string;
  menu_item_id: string;
  name: string;
  description: string | null;
  price: number;
  seq: number;
}

interface MenuItem {
  id: string;
  name: string;
}

interface ItemOptionsManagerProps {
  menuItemId: string;
  onBack: () => void;
}

interface SortableOptionProps {
  option: ItemOption;
  onEdit: (option: ItemOption) => void;
  onDelete: (id: string) => void;
}

function SortableOption({ option, onEdit, onDelete }: SortableOptionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: option.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-sm border p-4 flex items-center space-x-4 ${
        isDragging ? 'shadow-lg ring-2 ring-accent-mint opacity-50' : ''
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
          <h4 className="font-semibold text-gray-800">{option.name}</h4>
          <span className="text-accent-mint font-semibold">
            {option.price === 0 ? 'Free' : `+$${option.price.toFixed(2)}`}
          </span>
        </div>
        {option.description && (
          <p className="text-sm text-gray-600 mt-1">{option.description}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onEdit(option)}
          className="text-gray-600 hover:text-accent-mint transition-colors p-2"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={() => onDelete(option.id)}
          className="text-gray-600 hover:text-red-600 transition-colors p-2"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export function ItemOptionsManager({ menuItemId, onBack }: ItemOptionsManagerProps) {
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [options, setOptions] = useState<ItemOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOption, setEditingOption] = useState<ItemOption | null>(null);
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
    fetchMenuItemAndOptions();
  }, [menuItemId]);

  const fetchMenuItemAndOptions = async () => {
    try {
      const { data: itemData, error: itemError } = await supabase
        .from('menu_item')
        .select('id, name')
        .eq('id', menuItemId)
        .single();

      if (itemError) throw itemError;
      setMenuItem(itemData);

      const { data: optionsData, error: optionsError } = await supabase
        .from('item_options')
        .select('*')
        .eq('menu_item_id', menuItemId)
        .order('seq', { ascending: true });

      if (optionsError) throw optionsError;
      setOptions(optionsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = options.findIndex((opt) => opt.id === active.id);
    const newIndex = options.findIndex((opt) => opt.id === over.id);

    const updatedItems = arrayMove(options, oldIndex, newIndex).map((item, index) => ({
      ...item,
      seq: index
    }));

    setOptions(updatedItems);

    try {
      for (const item of updatedItems) {
        await supabase
          .from('item_options')
          .update({ seq: item.seq })
          .eq('id', item.id);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      fetchMenuItemAndOptions();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingOption) {
        const { error } = await supabase
          .from('item_options')
          .update({
            name: formData.name,
            description: formData.description || null,
            price: parseFloat(formData.price),
            updated_at: new Date().toISOString()
          })
          .eq('id', editingOption.id);

        if (error) throw error;
      } else {
        const maxSeq = options.length > 0 ? Math.max(...options.map(o => o.seq)) : -1;

        const { error } = await supabase
          .from('item_options')
          .insert({
            menu_item_id: menuItemId,
            name: formData.name,
            description: formData.description || null,
            price: parseFloat(formData.price),
            seq: maxSeq + 1
          });

        if (error) throw error;
      }

      setFormData({ name: '', description: '', price: '' });
      setShowForm(false);
      setEditingOption(null);
      fetchMenuItemAndOptions();
    } catch (error) {
      console.error('Error saving option:', error);
    }
  };

  const handleEdit = (option: ItemOption) => {
    setEditingOption(option);
    setFormData({
      name: option.name,
      description: option.description || '',
      price: option.price.toString()
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this option?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('item_options')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchMenuItemAndOptions();
    } catch (error) {
      console.error('Error deleting option:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingOption(null);
    setFormData({ name: '', description: '', price: '' });
  };

  if (loading) {
    return <div className="text-center py-8">Loading options...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 transition-colors p-2"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Options for: {menuItem?.name}
          </h3>
          <p className="text-sm text-gray-600">
            Manage size variations, add-ons, and customizations
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h4 className="text-md font-semibold text-gray-700">Item Options</h4>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-accent-mint hover:bg-accent-mint/80 transition-colors text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>Add Option</span>
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-800">
              {editingOption ? 'Edit Option' : 'New Option'}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-mint focus:border-transparent"
                placeholder="e.g., Small, Large, Extra Cheese"
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
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-mint focus:border-transparent"
                placeholder="Optional details about this option"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Modifier
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-mint focus:border-transparent"
                placeholder="0.00"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Additional price for this option (use 0 if no extra charge)
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-accent-mint hover:bg-accent-mint/80 transition-colors text-white px-6 py-2 rounded-lg"
              >
                {editingOption ? 'Update' : 'Create'}
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
          items={options.map((opt) => opt.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {options.map((option) => (
              <SortableOption
                key={option.id}
                option={option}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {options.length === 0 && !showForm && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600">
            No options yet. Add options like sizes, add-ons, or customizations.
          </p>
        </div>
      )}
    </div>
  );
}
