import { Either, left, right } from '../../../commun/dto/either.js';
import { SupplierNotFoundError } from '../../../commun/errors/supplier-not-found.error.js';
import { Supplier } from '../dto/supplier.dto.js';
import { SupplierRepository } from '../repository/supplier.repository.js';

interface EditSupplierHandlerRequest {
  //tipo com o que vai ser usado na requisicao
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  instagram?: string;
  site?: string;
  description?: string;
  category?: string;
  contact_name?: string;
  is_active?: boolean;
}

type EditSupplierHandlerResponse = Either<SupplierNotFoundError, Supplier>; //tipo do response, either para determinar os retornos

export class EditSupplierHandler {
  constructor(private supplierRepository: SupplierRepository) {} //declata o repositorio como dependencia injetada

  async execute({
    //funcao asincrona principal
    id,
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
  }: EditSupplierHandlerRequest): Promise<EditSupplierHandlerResponse> {
    //passa o que vai ser usadno e a promise do tipo caso right
    const supplier = await this.supplierRepository.findById(id); //pesquisa por id para atualizar

    if (!supplier) {
      //se nao encontrar apresenta erro
      return left(new SupplierNotFoundError(id));
    }

    const updatedSupplier = await this.supplierRepository.save({
      //variavel que guarda o retorno do update
      id,
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

    return right(updatedSupplier); //retorno da direita do either do tipp Supplier
  }
}
