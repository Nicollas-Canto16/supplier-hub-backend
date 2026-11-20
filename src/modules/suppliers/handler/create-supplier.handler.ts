import { Injectable } from '@nestjs/common';
import { SupplierRepository } from '../repository/supplier.repository.js';
import { Either, left, right } from '../../../commun/dto/either.js';
import { Supplier } from '../dto/supplier.dto.js';

interface CreateSupplierHandlerRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  instagram: string;
  site: string;
  description: string;
  category: string;
  contact_name: string;
  is_active: boolean;
}

type CreateSupplierHandlerResponse = Either<Error, Supplier>;

@Injectable()
export class CreateSupplierHandler {
  constructor(private supplierRepository: SupplierRepository) {}

  async execute({
    name,
    email,
    phone,
    address,
    instagram,
    site,
    description,
    category,
    contact_name,
    is_active,
  }: CreateSupplierHandlerRequest): Promise<CreateSupplierHandlerResponse> {
    const supplier = await this.supplierRepository.create({
      name,
      email,
      phone,
      address,
      instagram,
      site,
      description,
      category,
      contact_name,
      is_active,
    });

    if (!supplier) {
      return left(new Error());
    }

    return right(supplier);
  }
}
