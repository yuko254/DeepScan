import type { Prisma } from '@prisma/client';

export class BaseRepository<
  Model extends {
    create: (args: any) => any;
    findUnique: (args: any) => any;
    findFirst: (args: any) => any;
    findMany: (args: any) => any;
    count: (args: any) => any;
    update: (args: any) => any;
    upsert: (args: any) => any;
    delete: (args: any) => any;
  }
> {
  constructor(
    protected model: Model,
    private modelName: keyof Prisma.TransactionClient,
    private pkField: string = 'id'
  ) { }
  
  protected filterMapping: Record<string, (value: any) => any> = {};
  protected buildWhere<F extends Record<string, any>>(filters?: F): any {
    if (!filters) return {};
    const where: any = {};
    for (const [key, value] of Object.entries(filters)) {
      if (value === undefined) continue;
      const fn = this.filterMapping[key];
      if (fn) Object.assign(where, fn(value));
    }
    return where;
  }
  
  withTx(tx?: Prisma.TransactionClient): this {
    if (!tx) return this;
    const scoped = Object.create(this) as this;
    scoped.model = tx[this.modelName] as unknown as Model;
    return scoped;
  }

  async create<A extends Parameters<Model['create']>[0]>(
    args: A
  ): Promise<Prisma.Result<Model, A, 'create'>> {
    return this.model.create(args as any) as any;
  }

  async upsert<A extends Parameters<Model['upsert']>[0]>(
    args: A
  ): Promise<Prisma.Result<Model, A, 'upsert'>> {
    return this.model.upsert(args as any) as any;
  }

  async findUnique<A extends Parameters<Model['findUnique']>[0]>(
    args: A
  ): Promise<Prisma.Result<Model, A, 'findUnique'>> {
    return this.model.findUnique(args as any) as any;
  }

  async findFirst<A extends Parameters<Model['findFirst']>[0]>(
    args: A
  ): Promise<Prisma.Result<Model, A, 'findFirst'>> {
    return this.model.findFirst(args as any) as any;
  }

  async findMany<A extends Parameters<Model['findMany']>[0]>(
    args: A
  ): Promise<Prisma.Result<Model, A, 'findMany'>> {
    return this.model.findMany(args as any) as any;
  }

  async count<A extends Parameters<Model['count']>[0]>(
    args: A
  ): Promise<Prisma.Result<Model, A, 'count'>> {
    return this.model.count(args as any) as any;
  }

  async update<A extends Parameters<Model['update']>[0]>(
    args: A
  ): Promise<Prisma.Result<Model, A, 'update'>> {
    return this.model.update(args as any) as any;
  }

  async delete<A extends Parameters<Model['delete']>[0]>(
    args: A
  ): Promise<Prisma.Result<Model, A, 'delete'>> {
    return this.model.delete(args as any) as any;
  }

  // ── Convenience methods ────────────────────────────

  async findById<A extends Parameters<Model['findUnique']>[0]>(
    id: string | bigint,
    options?: Omit<A, 'where'>
  ): Promise<Prisma.Result<Model, A, 'findUnique'>> {
    return this.model.findUnique({ where: { [this.pkField]: id }, ...(options as any) } as any) as any;
  }

  async findOne<A extends Parameters<Model['findUnique']>[0]>(
    where: A['where'],
    options?: Omit<A, 'where'>
  ): Promise<Prisma.Result<Model, A, 'findUnique'>> {
    return this.model.findUnique({ where, ...(options as any) } as any) as any;
  }

  async findOrCreate<
    A extends Parameters<Model['create']>[0],
    W extends Parameters<Model['findFirst']>[0]['where']
  >(
    where: W,
    data: A['data'],
    createOptions?: Omit<A, 'data'>
  ): Promise<Prisma.Result<Model, A, 'create'>> {
    const existing = await this.model.findFirst({ where } as any);
    if (existing) return existing as any;
    return this.create({ data, ...(createOptions ?? {}) } as any) as any;
  }
}