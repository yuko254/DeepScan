export class BaseDao<T, CreateInput, UpdateInput, WhereUniqueInput> {
  constructor(
    protected model: any
  ) {}

  async findById(id: String | bigint): Promise<T | null> {
    return this.model.findUnique({ where: id });
  }

  async find(ob: WhereUniqueInput): Promise<T | null> {
    return this.model.findUnique({ where: ob });
  }

  async findMany(options?: any): Promise<T[]> {
    return this.model.findMany(options);
  }

  async create(data: CreateInput): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: WhereUniqueInput, data: UpdateInput): Promise<T> {
    return this.model.update({ where: id, data });
  }

  async delete(id: WhereUniqueInput): Promise<T> {
    return this.model.delete({ where: id });
  }
}
