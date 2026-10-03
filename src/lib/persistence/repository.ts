/**
 * Core Persistence Repository Types (src/lib/persistence/repository.ts)
 */
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
}

export interface CrudRepository<T extends BaseEntity> {
  findById(id: string): Promise<T | null>;
  create(entity: Omit<T, "id" | "created_at">): Promise<T>;
  update(id: string, updates: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
