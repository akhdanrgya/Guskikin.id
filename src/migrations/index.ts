import * as migration_20260911_083855_add_news_avatar_schema from './20260911_083855_add_news_avatar_schema';

export const migrations = [
  {
    up: migration_20260911_083855_add_news_avatar_schema.up,
    down: migration_20260911_083855_add_news_avatar_schema.down,
    name: '20260911_083855_add_news_avatar_schema'
  },
];
