import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { SupplierModule } from '../modules/suppliers/suppliers.module.js';

@Module({
  imports: [DatabaseModule, SupplierModule],
})
export class AppModule {}
