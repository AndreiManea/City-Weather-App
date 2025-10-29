import { prisma } from '../../lib/prisma';
import type { DBCity, NewCityRecord } from './city.model';

export class CityRepository {
  async create(data: NewCityRecord): Promise<DBCity> {
    return prisma.city.create({ data });
  }

  async updatePartial(id: string, data: Partial<Pick<DBCity, 'touristRating'>>): Promise<DBCity> {
    return prisma.city.update({ where: { id }, data });
  }

  async deleteById(id: string): Promise<void> {
    await prisma.city.delete({ where: { id } });
  }

  async searchByName(name: string): Promise<DBCity[]> {
    const q = `%${name.toLowerCase()}%`;
    const rows = await prisma.$queryRaw<DBCity[]>`
      SELECT id, name, country, touristRating, createdAt, updatedAt
      FROM City
      WHERE LOWER(name) LIKE ${q}
      ORDER BY name ASC
      LIMIT 20;
    `;
    return rows;
  }

  async findById(id: string): Promise<DBCity | null> {
    return prisma.city.findUnique({ where: { id } });
  }
}
