import { useState } from 'react';
import { Add01Icon, Edit02Icon, Delete02Icon } from 'hugeicons-react';
import { useMyServices, useDeleteService } from '@/hooks/useServices';
import { ServiceForm } from '@/components/services/ServiceForm';
import { DeleteServiceDialog } from '@/components/services/DeleteServiceDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';
import type { Service } from '@/types/api';

/**
 * Provider's service management page with add/edit/delete functionality.
 */
export function MyServices() {
  const { data: result, isLoading } = useMyServices();
  const { mutate: deleteService, isPending: isDeleting } = useDeleteService();
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const services = result?.data ?? [];

  const handleDelete = (id: string) => {
    deleteService(id, {
      onSuccess: () => setConfirmDeleteId(null),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Services</h1>
          <Button onClick={() => { setEditingService(null); setShowForm(true); }}>
            <Add01Icon className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>

        {/* Create/Edit form */}
        {showForm && (
          <div className="bg-white dark:bg-card rounded-xl border dark:border-border p-6 mb-6">
            <h2 className="font-semibold mb-4">
              {editingService ? 'Edit Service' : 'New Service'}
            </h2>
            <ServiceForm
              service={editingService ?? undefined}
              onSuccess={() => { setShowForm(false); setEditingService(null); }}
              onCancel={() => { setShowForm(false); setEditingService(null); }}
            />
          </div>
        )}

        {/* Services list */}
        {isLoading ? (
          <p className="text-center text-gray-400 dark:text-gray-500 py-12">Loading services...</p>
        ) : services.length === 0 ? (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500">
            <p>No services yet. Add your first service to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {services.map((service) => (
              <div key={service.id} className="bg-white dark:bg-card rounded-xl border dark:border-border p-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium">{service.name}</h3>
                    <Badge className="text-xs bg-gray-100 dark:bg-muted text-gray-600 dark:text-gray-400">
                      {service.category.replace('_', ' ')}
                    </Badge>
                    {!service.isActive && (
                      <Badge className="text-xs bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400">Inactive</Badge>
                    )}
                  </div>
                  {service.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{service.description}</p>
                  )}
                  <p className="text-sm font-semibold text-gray-900 dark:text-foreground mt-1">
                    ₦{service.basePrice.toLocaleString()} / {service.unit.replace('_', ' ')}
                  </p>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setEditingService(service); setShowForm(true); }}
                  >
                    <Edit02Icon className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50"
                    onClick={() => setConfirmDeleteId(service.id)}
                  >
                    <Delete02Icon className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete confirmation dialog */}
        {confirmDeleteId && (
          <DeleteServiceDialog
            isDeleting={isDeleting}
            onCancel={() => setConfirmDeleteId(null)}
            onConfirm={() => handleDelete(confirmDeleteId)}
          />
        )}
      </main>
    </div>
  );
}
