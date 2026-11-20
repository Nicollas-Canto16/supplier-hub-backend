import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodError, ZodType } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodType) {}
  transform(value: unknown): unknown {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(JSON.stringify(error, null, 2));
        throw new BadRequestException({
          message: 'Validation failed',
          errors: error.issues.map((issue) => {
            field: issue.path.join('.');
            message: issue.message;
          }),
        });
      }
    }
  }
}
