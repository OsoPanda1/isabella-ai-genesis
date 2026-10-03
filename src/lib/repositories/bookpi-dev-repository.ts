/**
 * BookPI Development Repository (src/lib/repositories/bookpi-dev-repository.ts)
 */
import { BookPiRepository, bookpiPostgresRepository } from "./bookpi-postgres-repository";

export const bookpiDevRepository: BookPiRepository = bookpiPostgresRepository;
export default bookpiDevRepository;
