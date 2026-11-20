import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import z, { string } from 'zod';
import { CreateSupplierHandler } from '../handler/create-supplier.handler.js';
import { ZodValidationPipe } from '../../../infra/http/pipes/zod-validation-pipe.js';
import { ListSuppliersHandler } from '../handler/list-suppliers.handler.js';
import { GetSupplierByIdHandler } from '../handler/get-supplier-by-id.handler.js';
import { SupplierNotFoundError } from '../../../commun/errors/supplier-not-found.error.js';

const getSupplierParamSchema = string().min(1);

@ApiTags('Fornecedores')
@ApiBearerAuth()
@Controller('suppliers')
export class GetSupplierController {
  constructor(private getSupplierByIdHandler: GetSupplierByIdHandler) {}

  @Get(':id') // paramentro de rota : para um valor variavel
  @HttpCode(200)
  @ApiOperation({
    summary: 'Detalhar fornecedore',
    description: 'Retorna um fornecedor pelo seu id',
  })
  @ApiParam({
    name: 'id',
    type: String,
    format: 'uuid',
    example: '9b7c1f2e-3a4d-4b5c-8d9e-0f1a2b3c4d5e',
  })
  @ApiResponse({
    status: 200,
    description: 'Fornecedor retornado com sucesso',
    schema: {
      example: {
        id: '9b7c1f2e-3a4d-4b5c-8d9e-0f1a2b3c4d5e',
        name: 'Private Label',
        email: 'privatelabel@exemplo.com',
        phone: '00 000000000',
        address: 'Rua Tal Bairro Tal Numero 1',
        instagram: '@privatelabel',
        site: ' www.privatelabel.com.br',
        description: 'fornecedor de camisetas',
        category: 'confeccoes',
        contact_name: 'Joao',
        is_active: 'true',
        created_at: '2026-01-15T12:00:00.000Z',
        updated_at: '2026-01-15T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Corpo da requisição inválido' })
  @ApiResponse({ status: 401, description: 'Token ausente ou inválido' })
  @ApiResponse({ status: 404, description: 'Fornecedor nao encontrado' })
  async handle(
    @Param('id', new ZodValidationPipe(getSupplierParamSchema)) id: string,
  ) {
    const result = await this.getSupplierByIdHandler.execute({ id });

    if (result.isLeft()) {
      const error = result.value;

      throw new NotFoundException(error.message);
    }

    return result.value;
  }
}
