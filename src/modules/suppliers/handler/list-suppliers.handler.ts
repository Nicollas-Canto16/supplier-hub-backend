import { Injectable } from '@nestjs/common';
import { FilterSupplier, Supplier } from '../dto/supplier.dto.js';
import { Either, right } from '../../../commun/dto/either.js';
import { PaginatedResponse } from '../../../commun/dto/pagination.dto.js';
import { SupplierRepository } from '../repository/supplier.repository.js';

interface ListSupplierHandlerRequest {
  page?: number;
  pagesize?: number;
  orderby?: string;
  search?: string;
  filters?: FilterSupplier;
}

type ListUserHandlerResponse = Either<null, PaginatedResponse<Supplier>>;

@Injectable()
export class ListSuppliersHandler {
  constructor(private supplierRepository: SupplierRepository) {}

  async execute({
    page = 0,
    pagesize = 10,
    orderby = 'created_at:desc',
    search,
    filters,
  }: ListSupplierHandlerRequest): Promise<ListUserHandlerResponse> {
    const [data, total] = await Promise.all([
      this.supplierRepository.findMany({
        page,
        pagesize,
        orderby,
        search,
        filters,
      }),
      this.supplierRepository.count({ search, filters }),
    ]);
    return right({ data, page, pagesize, total });
  }
}
