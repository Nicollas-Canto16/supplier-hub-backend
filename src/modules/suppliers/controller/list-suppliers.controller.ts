import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import z from 'zod';
import { CreateSupplierHandler } from '../handler/create-supplier.handler.js';
import { ZodValidationPipe } from '../../../infra/http/pipes/zod-validation-pipe.js';
import { ListSuppliersHandler } from '../handler/list-suppliers.handler.js';

const listSupplierBodySchema = z.object({
  page: z.coerce.number().int().min(0).default(0),
  pagesize: z.coerce.number().int().min(1).max(100).default(10),
  orderby: z.string().default('created_at:desc'),
  search: z.string().optional(),
  is_active: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
});

type ListSupplierBodySchema = z.infer<typeof listSupplierBodySchema>;

@ApiTags('Fornecedores')
@ApiBearerAuth()
@Controller('suppliers')
export class ListSupplierController {
  constructor(private listSupplierHandler: ListSuppliersHandler) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Listar fornecedores',
    description: 'Lista paginada de fornecedores',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Pagina, comecando em 0',
    example: 0,
  })
  @ApiQuery({
    name: 'pagesize',
    required: false,
    type: Number,
    description: 'Itens por pagina (1 a 100)',
    example: 10,
  })
  @ApiQuery({
    name: 'orderby',
    required: false,
    type: String,
    description: 'Campo e direcao no foramto `campo:asc|desc`',
    example: 'created_at:desc',
  })
  @ApiQuery({
    name: 'seach',
    required: false,
    type: String,
    description: 'Busca por nome',
    example: 'joao',
  })
  @ApiQuery({
    name: 'is_active',
    required: false,
    enum: ['true', 'false'],
    description: 'filtra por fornecedores ativos e inativos',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista retornada com sucesso',
    schema: {
      example: {
        data: [
          {
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
        ],
        page: 0,
        pagesize: 10,
        total: 1,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Corpo da requisição inválido' })
  @ApiResponse({ status: 401, description: 'Token ausente ou inválido' })
  async handle(
    @Body(new ZodValidationPipe(listSupplierBodySchema))
    query: ListSupplierBodySchema,
  ) {
    const result = await this.listSupplierHandler.execute({
      page: query.page,
      pagesize: query.pagesize,
      orderby: query.orderby,
      search: query.search,
      filters: { is_active: query.is_active },
    });

    return result.value;
  }
}
