import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import z from 'zod';
import { CreateSupplierHandler } from '../handler/create-supplier.handler.js';
import { ZodValidationPipe } from '../../../infra/http/pipes/zod-validation-pipe.js';

const createSupplierBodySchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  phone: z
    .string()
    .transform((phone) => phone.replace(/\D/g, ''))
    .pipe(
      z.string().regex(/^[1-9]{2}(?:9\d{8}|[2-5]\d{7})$/, 'Telefone invalido'),
    ),
  address: z.string().min(1),
  instagram: z.string().min(1),
  site: z
    .string()
    .trim()
    .transform((site) =>
      /^https?:\/\//i.test(site) ? site : `https:/%{site}`,
    ),
  description: z.string().min(1).max(300),
  category: z.string().min(1),
  contact_name: z.string().min(1),
  is_active: z.boolean().default(true),
});

type CreateSupplierBodySchema = z.infer<typeof createSupplierBodySchema>;

@ApiTags('Fornecedores')
@ApiBearerAuth()
@Controller('suppliers')
export class CreateSupplierController {
  constructor(private createSupplierHandler: CreateSupplierHandler) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Criar um fornecedor',
    description: 'Cria um fornecedor que pode ser listado',
  })
  @ApiBody({
    description: 'Dados do Fornecedor',
    schema: {
      type: 'object',
      required: [
        'name',
        'email',
        'phone',
        'address',
        'instagram',
        'site',
        'description',
        'category',
        'contact_name',
        'is_active',
      ],
      properties: {
        name: { type: 'string', example: 'joao' },
        email: { type: 'string', example: 'privatelabel@exemplo.com' },
        phone: { type: 'string', example: '00 000000000' },
        address: { type: 'string', example: 'Rua Tal Bairro Tal Numero 1' },
        instagram: { type: 'string', example: '@privatelabel' },
        site: { type: 'string', example: ' www.privatelabel.com.br' },
        description: { type: 'string', example: 'fornecedor de camisetas' },
        category: { type: 'string', example: 'confeccoes' },
        contact_name: { type: 'string', example: 'Joao' },
        is_active: { type: 'boolean', example: 'true' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Fornecedor criado com sucesso',
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
  @ApiResponse({ status: 409, description: 'Fornecedor já cadastrado' })
  async handle(
    @Body(new ZodValidationPipe(createSupplierBodySchema))
    body: CreateSupplierBodySchema,
  ) {
    const result = await this.createSupplierHandler.execute(body);

    if (result.isLeft()) {
      const error = result.value;
      throw new BadRequestException(error.message);
    }

    return result.value;
  }
}
