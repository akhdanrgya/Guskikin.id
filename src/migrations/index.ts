import * as migration_20260911_083855_add_news_avatar_schema from './20260911_083855_add_news_avatar_schema';
import * as migration_20260911_101500_add_visitor_analytics from './20260911_101500_add_visitor_analytics';

export const migrations = [
  {
    up: migration_20260911_083855_add_news_avatar_schema.up,
    down: migration_20260911_083855_add_news_avatar_schema.down,
    name: '20260911_083855_add_news_avatar_schema'
  },
  {
    up: migration_20260911_101500_add_visitor_analytics.up,
    down: migration_20260911_101500_add_visitor_analytics.down,
    name: '20260911_101500_add_visitor_analytics'
  },
];
