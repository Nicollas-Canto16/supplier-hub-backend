import { Global, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

export interface WhereFieldProps {
  name: string;
  type:
    | 'string'
    | 'number'
    | 'boolean'
    | 'date'
    | 'int'
    | 'numberToString'
    | 'object';

  exact?: boolean;
  custom?: (search: string) => Record<string, any>;
}

type FieldConfig = Omit<WhereFieldProps, 'name'>;

@Global()
@Injectable()
export class WhereFilterPrisma {
  /**
   * Exemplos de normalizacao por tipo:
   * - string: "Matheus" -> { contains: "Matheus", mode: "insensitive" }
   * - string (exact): "Matheus" -> "Matheus"
   * - number: "10.5" -> 10.5
   * - int: "ID-123" -> 123
   * - numberToString: "12.345-6" -> "123456"
   * - boolean: "true" -> true | "false" -> false | "null" -> null
   * - date: "2026-04-14" -> { gte: inicio do dia, lte: fim do dia }
   * - date (operador): ">= 2026-04-01" -> { gte: inicio do dia }
   * - date (between): "2026-04-01 BETWEEN 2026-04-14" -> { gte, lte }
   * - object: { foo: "bar" } -> { foo: "bar" }
   * - array: ["A", "B"] -> { in: [normalizados...] }
   */
  static onNormalizedValue(field: FieldConfig, value: any): any {
    if (value === undefined || value === '') return undefined;

    if (field.custom) {
      return field.custom(value);
    }

    if (Array.isArray(value)) {
      return this.normalizeArray(field, value);
    }

    switch (field.type) {
      case 'string':
        return field.exact ? value : { contains: value, mode: 'insensitive' };

      case 'number': {
        const parsed = Number(value);
        if (isNaN(parsed)) return undefined;
        return parsed;
      }

      case 'int': {
        const sanitized = String(value).replace(/[^\d]/g, '');
        if (!sanitized) return undefined;

        const parsed = Number(sanitized);
        if (isNaN(parsed) || parsed >= 2147483647) return undefined;
        return parsed;
      }

      case 'numberToString': {
        const sanitized = String(value).replace(/[^\d]/g, '');
        if (!sanitized) return undefined;
        return sanitized;
      }

      case 'boolean': {
        if (value === null || value === 'null') return null;
        if (value === true || value === 'true' || value === 1 || value === '1')
          return true;
        if (
          value === false ||
          value === 'false' ||
          value === 0 ||
          value === '0'
        )
          return false;
        return undefined; // valor desconhecido: ignora o filtro
      }

      case 'date': {
        if (typeof value !== 'string') return undefined;

        // BETWEEN
        const betweenMatch = value.match(/(.+)\s+BETWEEN\s+(.+)/i);
        if (betweenMatch) {
          const [, startStr, endStr] = betweenMatch;
          const start = dayjs(startStr.trim());
          const end = dayjs(endStr.trim());

          if (!start.isValid() || !end.isValid()) return undefined;

          return {
            gte: start.startOf('day').toDate(),
            lte: end.endOf('day').toDate(),
          };
        }

        // OPERATORS
        const operatorMatch = value.match(/^(>=|<=|>|<)\s*(.+)$/);
        if (operatorMatch) {
          const [, operator, dateStr] = operatorMatch;
          const date = dayjs(dateStr.trim());
          if (!date.isValid()) return undefined;

          switch (operator) {
            case '>':
              return { gt: date.endOf('day').toDate() };
            case '>=':
              return { gte: date.startOf('day').toDate() };
            case '<':
              return { lt: date.startOf('day').toDate() };
            case '<=':
              return { lte: date.endOf('day').toDate() };
            default:
              return undefined;
          }
        }

        // DATE SIMPLE
        const parsed = dayjs(value);
        if (!parsed.isValid()) return undefined;

        return field.exact
          ? parsed.toDate()
          : {
              gte: parsed.startOf('day').toDate(),
              lte: parsed.endOf('day').toDate(),
            };
      }

      case 'object':
        return value;

      default:
        return undefined;
    }
  }

  private static normalizeArray(
    field: FieldConfig,
    values: any[],
  ): { in: any[] } | undefined {
    const normalized = values
      .map((value) => this.onNormalizedValue({ ...field }, value))
      .filter((v) => v !== undefined);

    if (normalized.length === 0) return undefined;

    return { in: normalized };
  }

  execute(
    filters: Record<string, any> | undefined,
    fields: WhereFieldProps[],
  ): Record<string, any> {
    if (!filters || Object.keys(filters).length === 0) return {};

    const andConditions: Record<string, any>[] = [];

    for (const field of fields) {
      const value = filters[field.name];

      if (value === undefined || value === '' || value === null) continue;

      const fieldPath = field.name.split('.');

      if (field.custom) {
        andConditions.push(field.custom(value));
        continue;
      }

      const normalizedValue = WhereFilterPrisma.onNormalizedValue(
        {
          type: field.type,
          exact: field.exact,
          custom: field.custom,
        },
        value,
      );

      // null é válido (ex.: boolean "null" -> IS NULL); só ignora undefined
      if (normalizedValue !== undefined) {
        andConditions.push(
          fieldPath.reduceRight<any>(
            (acc, key) => ({ [key]: acc }),
            normalizedValue,
          ),
        );
      }
    }

    return andConditions.length > 0 ? { AND: andConditions } : {};
  }
}
