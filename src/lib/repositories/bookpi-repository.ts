/**
 * BookPI Repository Interface & Factory
 * -----------------------------------------------------------------
 * Única entrada de repositorio para el ledger durable.
 * La implementación productiva es PostgreSQL; el adaptador de desarrollo
 * queda separado explícitamente en bookpi-dev-repository.ts.
 */
import {
  BookPiRepository,
  bookpiPostgresRepository,
  bookpiMemoryRepository,
} from "./bookpi-postgres-repository";

export function createBookpiRepository(): BookPiRepository {
  return bookpiPostgresRepository;
}

export function createBookpiMemoryRepository(): BookPiRepository {
  return bookpiMemoryRepository;
}

export function getBookPiRepository(): BookPiRepository {
  return bookpiPostgresRepository;
}

export {
  BookPiRepository,
  bookpiPostgresRepository,
  bookpiMemoryRepository,
};

export default bookpiPostgresRepository;
