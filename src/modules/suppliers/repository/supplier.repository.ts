import {
  FindManySupplier,
  FindManySupplierPagination,
  Supplier,
  SupplierCreate,
  SupplierUpdate,
} from '../dto/supplier.dto.js';

export abstract class SupplierRepository {
  abstract create(supplier: SupplierCreate): Promise<Supplier>;
  abstract findById(id: string): Promise<Supplier | null>;
  abstract findMany(params: FindManySupplierPagination): Promise<Supplier[]>;
  abstract count(params: FindManySupplier): Promise<number>;
  abstract save(supplier: SupplierUpdate): Promise<Supplier>;
}
