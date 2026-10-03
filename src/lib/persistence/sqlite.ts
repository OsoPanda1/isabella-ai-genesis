/**
 * SQLite / Local Persistence Fallback (src/lib/persistence/sqlite.ts)
 * -------------------------------------------------------------
 * Provides lightweight fallback storage for local development and unit tests.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

class LocalJsonStore {
  private dataDir: string;

  constructor() {
    this.dataDir = resolve(process.cwd(), ".data");
    if (!existsSync(this.dataDir)) {
      try {
        mkdirSync(this.dataDir, { recursive: true });
      } catch {
        // Safe ignore
      }
    }
  }

  public get<T>(collection: string): T[] {
    const file = resolve(this.dataDir, `${collection}.json`);
    if (!existsSync(file)) return [];
    try {
      return JSON.parse(readFileSync(file, "utf8")) as T[];
    } catch {
      return [];
    }
  }

  public set<T>(collection: string, items: T[]): void {
    const file = resolve(this.dataDir, `${collection}.json`);
    try {
      writeFileSync(file, JSON.stringify(items, null, 2), "utf8");
    } catch {
      // Safe fallback
    }
  }
}

export const localStore = new LocalJsonStore();
export default localStore;
