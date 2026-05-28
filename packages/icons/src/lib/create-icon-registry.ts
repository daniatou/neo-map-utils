import { gisIconPack } from '../generated/gis-icons';
import { defaultIconPack } from './default-icons';
import { IconRegistry } from './icon-registry';

export function createIconRegistry(): IconRegistry {
  const registry = new IconRegistry(defaultIconPack.icons['layers']);
  registry.registerPack(defaultIconPack);
  registry.registerPack(gisIconPack);
  return registry;
}
