import { Module } from '@nestjs/common';
import { CreateSupplierController } from './controller/create-supplier.controller.js';
import { CreateSupplierHandler } from './handler/create-supplier.handler.js';
import { ListSuppliersHandler } from './handler/list-suppliers.handler.js';
import { ListSupplierController } from './controller/list-suppliers.controller.js';

@Module({
  controllers: [CreateSupplierController, ListSupplierController],
  providers: [CreateSupplierHandler, ListSuppliersHandler],
})
export class SupplierModule {}
