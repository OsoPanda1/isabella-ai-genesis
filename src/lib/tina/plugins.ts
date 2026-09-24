/**
 * TINA plugin registry with declared permissions (src/lib/tina/plugins.ts)
 */
import type { TinaBookPI } from "./ledger";

export interface TinaPluginManifest {
  id: string;
  version: string;
  publisher: string;
  permissions: {
    read: string[];
    write: string[];
    tools: string[];
    networkAllow: string[];
  };
}

export interface TinaPlugin {
  manifest: TinaPluginManifest;
  run(input: unknown): Promise<unknown>;
}

export class TinaPluginRegistry {
  private plugins = new Map<string, TinaPlugin>();

  constructor(private readonly bookpi: TinaBookPI) {}

  async install(plugin: TinaPlugin): Promise<void> {
    const { id, version, publisher, permissions } = plugin.manifest;
    if (this.plugins.has(id)) throw new Error("Plugin ya instalado");
    if (!id || !version || !publisher) throw new Error("Manifest inválido");
    if (!permissions || typeof permissions !== "object") throw new Error("Permisos requeridos");
    this.plugins.set(id, plugin);
    await this.bookpi.append("PLUGIN_INSTALLED", {
      pluginId: id,
      version,
      publisher,
      permissions,
    });
  }

  async invoke(id: string, input: unknown): Promise<unknown> {
    const plugin = this.plugins.get(id);
    if (!plugin) throw new Error("Plugin no encontrado");
    const out = await plugin.run(input);
    await this.bookpi.append("PLUGIN_INVOKED", { pluginId: id });
    return out;
  }

  catalog(): TinaPluginManifest[] {
    return [...this.plugins.values()].map((p) => p.manifest);
  }

  has(id: string): boolean {
    return this.plugins.has(id);
  }
}
