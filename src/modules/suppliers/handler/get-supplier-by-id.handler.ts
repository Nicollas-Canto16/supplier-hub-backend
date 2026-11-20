import { Injectable } from '@nestjs/common';
import { SupplierRepository } from '../repository/supplier.repository.js';
import { Either, left, right } from '../../../commun/dto/either.js';
import { SupplierNotFoundError } from '../../../commun/errors/supplier-not-found.error.js';
import { Supplier } from '../dto/supplier.dto.js';

interface GetSupplierByIdHandlerRequest {
  //o que vai ser usado na requisicao
  id: string;
}

type GetSupplierByIdHandlerResponse = Either<SupplierNotFoundError, Supplier>; //o que vai ser a respose, nesse caso ou erro ou tipo Supplier

@Injectable() // para ter injecao de dependencias
export class GetSupplierByIdHandler {
  //exportacao da classe
  constructor(private supplierRepository: SupplierRepository) {} //monsta o constructor com a injecao de dependencias(repository) para usar as classes do repository
  async execute({
    //funcao asincrona
    id, //parametro usado
  }: GetSupplierByIdHandlerRequest): Promise<GetSupplierByIdHandlerResponse> {
    //tipo request e a promise do tipo response
    const supplier = await this.supplierRepository.findById(id); //variavl que guarda o retorno da funcao do repositorio

    if (!supplier) {
      //verificacao se obteve resultado
      return left(new SupplierNotFoundError(id)); //left do either retornando o tipo da direita com o identificador que vai ser usado no erro
    }

    return right(supplier); //retorno da direita do either do tipo Supplier
  }
}
