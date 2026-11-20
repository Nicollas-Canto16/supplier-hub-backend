import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service.js';
import { SupplierRepository } from '../../modules/suppliers/repository/supplier.repository.js';
import { PrismaSupplierRepository } from './prisma/repositories/prisma-supplier.repository.js';
import { OrderByPrisma } from '../../commun/utils/order-by-prisma.utils.js';
import { SearchFilterPrisma } from '../../commun/utils/search-filter-prisma.utils.js';
import { WhereFilterPrisma } from '../../commun/utils/where-filter-prisma.utils.js';

@Global()
@Module({
  providers: [
    PrismaService,
    OrderByPrisma,
    SearchFilterPrisma,
    WhereFilterPrisma,
    { provide: SupplierRepository, useClass: PrismaSupplierRepository },
  ],
  exports: [PrismaService, SupplierRepository],
})
export class DatabaseModule {}
