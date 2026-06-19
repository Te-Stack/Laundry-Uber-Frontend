import type { User } from './user';

// ============================================================================
// Service Types
// ============================================================================

export type ServiceCategory = 'washing' | 'dry_cleaning' | 'ironing' | 'folding' | 'special';
export type ServiceUnit = 'per_piece' | 'per_kg' | 'per_load';

export interface Service {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
  unit: ServiceUnit;
  estimatedDuration: number;
  category: ServiceCategory;
  isActive: boolean;
  providerId: string | null;
  createdAt: string;
  updatedAt: string;
  provider?: User;
}

export interface CreateServicePayload {
  name: string;
  description?: string;
  basePrice: number;
  unit: ServiceUnit;
  estimatedDuration?: number;
  category: ServiceCategory;
}

export interface UpdateServicePayload extends Partial<CreateServicePayload> {
  isActive?: boolean;
}
