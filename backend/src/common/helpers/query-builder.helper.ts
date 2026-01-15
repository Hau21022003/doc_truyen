import { SelectQueryBuilder } from 'typeorm';
import { Brackets } from 'typeorm';

/**
 * Helper class cho các query builder utilities
 */
export class QueryBuilderHelper {
  /**
   * Áp dụng tìm kiếm cho nhiều trường
   */
  static applySearch(
    queryBuilder: SelectQueryBuilder<any>, // hoặc SelectQueryBuilder<unknown>
    alias: string,
    search?: string,
    fields: string[] = ['name', 'title'],
  ): SelectQueryBuilder<any> {
    if (!search) return queryBuilder;

    return queryBuilder.andWhere(
      new Brackets((qb) => {
        fields.forEach((field, index) => {
          const condition = `${alias}.${field} ILIKE :search`;
          index === 0
            ? qb.where(condition, { search: `%${search}%` })
            : qb.orWhere(condition, { search: `%${search}%` });
        });
      }),
    );
  }

  /**
   * Áp dụng phân trang
   */
  static applyPagination(
    queryBuilder: SelectQueryBuilder<any>,
    page: number = 1,
    limit: number = 10,
  ): SelectQueryBuilder<any> {
    return queryBuilder.skip((page - 1) * limit).take(limit);
  }

  /**
   * Áp dụng sắp xếp an toàn
   */
  static applySorting(
    queryBuilder: SelectQueryBuilder<any>,
    alias: string,
    sortBy?: string,
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    allowedSortFields: string[] = ['createdAt', 'updatedAt', 'name', 'id'],
  ): SelectQueryBuilder<any> {
    if (!sortBy) {
      return queryBuilder.orderBy(`${alias}.createdAt`, 'DESC');
    }

    const field = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    return queryBuilder.orderBy(`${alias}.${field}`, sortOrder);
  }

  /**
   * Áp dụng lọc theo khoảng ngày
   */
  static applyDateRange(
    queryBuilder: SelectQueryBuilder<any>,
    alias: string,
    startDateKey: string = 'createdAt',
    endDateKey: string = 'createdAt',
    startDate?: string,
    endDate?: string,
  ): SelectQueryBuilder<any> {
    if (startDate) {
      queryBuilder.andWhere(`${alias}.${startDateKey} >= :startDate`, { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere(`${alias}.${endDateKey} <= :endDate`, { endDate });
    }

    return queryBuilder;
  }

  /**
   * Áp dụng điều kiện cho các trường boolean
   */
  static applyBooleanFilter(
    queryBuilder: SelectQueryBuilder<any>,
    alias: string,
    fieldName: string,
    value?: boolean,
  ): SelectQueryBuilder<any> {
    if (value !== undefined) {
      queryBuilder.andWhere(`${alias}.${fieldName} = :${fieldName}`, { [fieldName]: value });
    }
    return queryBuilder;
  }
}