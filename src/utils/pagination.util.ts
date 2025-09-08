import z from 'zod';

export const PaginationQuerySchema = z.object({
  limit: z.coerce.number().min(0).max(100).default(10),
  offset: z.coerce.number().min(0).default(0),
});

export class PaginationResponse<T> {
  public items: T[];
  public total: number;
  public size: number;

  constructor(data: { items: T[]; total: number; size: number }) {
    this.items = data.items;
    this.total = data.total;
    this.size = data.size;
  }
}
