import { Pagination } from '../../../commun/dto/pagination.dto.js';

export type Supplier = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  instagram: string;
  site: string;
  description: string;
  category: string;
  contact_name: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
};

export type SupplierCreate = Pick<
  Supplier,
  | 'name'
  | 'email'
  | 'phone'
  | 'address'
  | 'instagram'
  | 'site'
  | 'description'
  | 'category'
  | 'contact_name'
> & {
  is_active?: boolean;
};

export type SupplierUpdate = { id: string } & Partial<
  Pick<
    Supplier,
    | 'name'
    | 'email'
    | 'phone'
    | 'address'
    | 'instagram'
    | 'site'
    | 'description'
    | 'category'
    | 'contact_name'
    | 'is_active'
  >
>;

export type FilterSupplier = {
  is_active?: boolean;
};

export type FindManySupplier = {
  search?: string;
  filters?: FilterSupplier;
};

export type FindManySupplierPagination = Pagination & FindManySupplier;
