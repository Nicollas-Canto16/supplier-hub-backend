import { Injectable } from '@nestjs/common';
import { SupplierRepository } from '../../../../modules/suppliers/repository/supplier.repository.js';
import { PrismaService } from '../prisma.service.js';
import {
  SupplierCreate,
  Supplier,
  FindManySupplierPagination,
  FindManySupplier,
  SupplierUpdate,
} from '../../../../modules/suppliers/dto/supplier.dto.js';
import { OrderByPrisma } from '../../../../commun/utils/order-by-prisma.utils.js';
import { SearchFilterPrisma } from '../../../../commun/utils/search-filter-prisma.utils.js';
import { WhereFilterPrisma } from '../../../../commun/utils/where-filter-prisma.utils.js';

const supplierSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  address: true,
  instagram: true,
  site: true,
  description: true,
  category: true,
  contact_name: true,
  created_at: true,
  updated_at: true,
  is_active: true,
} as const;

@Injectable()
export class PrismaSupplierRepository implements SupplierRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderBy: OrderByPrisma,
    private readonly searchFilter: SearchFilterPrisma,
    private readonly whereFilter: WhereFilterPrisma,
  ) {}

  private buildWhere({ search, filters }: FindManySupplier) {
    return {
      ...this.searchFilter.execute(search, [{ name: 'name', type: 'string' }]),
      ...this.whereFilter.execute(filters, [
        { name: 'is_active', type: 'boolean' },
      ]),
    };
  }

  async findById(id: string): Promise<Supplier | null> {
    return this.prisma.supplier.findUnique({ where: { id } });
  }

  async findMany({
    page = 0,
    pagesize = 10,
    orderby,
    search,
    filters,
  }: FindManySupplierPagination): Promise<Supplier[]> {
    return this.prisma.supplier.findMany({
      skip: page * pagesize,
      take: pagesize,
      where: this.buildWhere({ search, filters }),
      orderBy: this.orderBy.execute(orderby) ?? { created_at: 'desc' },
      select: supplierSelect,
    });
  }

  async count({ search, filters }: FindManySupplier): Promise<number> {
    return this.prisma.supplier.count({
      where: this.buildWhere({ search, filters }),
    });
  }

  async save({ id, ...supplier }: SupplierUpdate): Promise<Supplier> {
    return this.prisma.supplier.update({
      where: { id },
      data: supplier,
      select: supplierSelect,
    });
  }

  async create(supplier: SupplierCreate): Promise<Supplier> {
    return this.prisma.supplier.create({
      data: supplier,
      select: supplierSelect,
    });
  }
}
