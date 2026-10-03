/**
 * BookPI Repository Interface & Factory (src/lib/repositories/bookpi-repository.ts)
 */
import { BookPiRepository, bookpiPostgresRepository } from "./bookpi-postgres-repository";

export function getBookPiRepository(): BookPiRepository {
  return bookpiPostgresRepository;
}

export { BookPiRepository, bookpiPostgresRepository };
export default bookpiPostgresRepository;
