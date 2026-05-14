import { useState } from 'react';
import { useCreateService, useUpdateService } from '@/hooks/useServices';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Service, ServiceCategory, ServiceUnit } from '@/types/api';

interface ServiceFormProps {
  service?: Service;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CATEGORIES: ServiceCategory[] = ['washing', 'dry_cleaning', 'ironing', 'folding', 'special'];
const UNITS: ServiceUnit[] = ['per_piece', 'per_kg', 'per_load'];

/**
 * Form for creating or editing a service.
 * Uses useCreateService or useUpdateService depending on whether a service is provided.
 */
export function ServiceForm({ service, onSuccess, onCancel }: ServiceFormProps) {
  const isEdit = !!service;
  const { mutate: createService, isPending: isCreating } = useCreateService();
  const { mutate: updateService, isPending: isUpdating } = useUpdateService();

  const [form, setForm] = useState({
    name: service?.name ?? '',
    description: service?.description ?? '',
    basePrice: service?.basePrice?.toString() ?? '',
    unit: service?.unit ?? ('per_kg' as ServiceUnit),
    estimatedDuration: service?.estimatedDuration?.toString() ?? '',
    category: service?.category ?? ('washing' as ServiceCategory),
  });

  const isPending = isCreating || isUpdating;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description || undefined,
      basePrice: parseFloat(form.basePrice),
      unit: form.unit,
      estimatedDuration: form.estimatedDuration ? parseInt(form.estimatedDuration) : undefined,
      category: form.category,
    };

    if (isEdit) {
      updateService({ id: service.id, payload }, { onSuccess });
    } else {
      createService(payload, { onSuccess });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">Service Name</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g., Wash & Fold"
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Describe your service..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="basePrice">Base Price (₦)</Label>
          <Input
            id="basePrice"
            type="number"
            min="0"
            step="0.01"
            value={form.basePrice}
            onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="unit">Unit</Label>
          <select
            id="unit"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value as ServiceUnit })}
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>{u.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as ServiceCategory })}
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="duration">Est. Duration (hours)</Label>
          <Input
            id="duration"
            type="number"
            min="0"
            value={form.estimatedDuration}
            onChange={(e) => setForm({ ...form, estimatedDuration: e.target.value })}
            placeholder="24"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : isEdit ? 'Update Service' : 'Create Service'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
