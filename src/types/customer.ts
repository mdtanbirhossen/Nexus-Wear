export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

export interface Customer {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  image?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  status: CustomerStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerResponse {
    data: Customer[];
    total: number;
    page: number;
    limit: number;
}
