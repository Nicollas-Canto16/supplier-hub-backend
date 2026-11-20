import { HandlerError } from '../dto/handler-error.js';

export class SupplierNotFoundError extends Error implements HandlerError {
  constructor(private identifier: string) {
    super(`Fornecedor "${identifier}" nao encontrado`);
  }
}
