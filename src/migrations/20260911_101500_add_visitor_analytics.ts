import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs } from '@payloadcms/db-postgres'

/** Additive analytics storage. No existing content tables or rows are changed. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "gk_analytics_visitors" (
      "visitor_id" uuid PRIMARY KEY NOT NULL,
      "first_seen" timestamp with time zone DEFAULT NOW() NOT NULL,
      "last_seen" timestamp with time zone DEFAULT NOW() NOT NULL,
      "country" varchar(2),
      "region" varchar(80),
      "city" varchar(120)
    );

    CREATE TABLE IF NOT EXISTS "gk_analytics_sessions" (
      "session_id" uuid PRIMARY KEY NOT NULL,
      "visitor_id" uuid NOT NULL,
      "started_at" timestamp with time zone DEFAULT NOW() NOT NULL,
      "last_seen" timestamp with time zone DEFAULT NOW() NOT NULL,
      "current_path" varchar(300) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "gk_analytics_page_views" (
      "id" bigserial PRIMARY KEY NOT NULL,
      "visitor_id" uuid NOT NULL,
      "session_id" uuid NOT NULL,
      "pathname" varchar(300) NOT NULL,
      "viewed_at" timestamp with time zone DEFAULT NOW() NOT NULL
    );

    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'gk_analytics_sessions_visitor_fk') THEN
        ALTER TABLE "gk_analytics_sessions"
          ADD CONSTRAINT "gk_analytics_sessions_visitor_fk"
          FOREIGN KEY ("visitor_id") REFERENCES "public"."gk_analytics_visitors"("visitor_id")
          ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'gk_analytics_page_views_visitor_fk') THEN
        ALTER TABLE "gk_analytics_page_views"
          ADD CONSTRAINT "gk_analytics_page_views_visitor_fk"
          FOREIGN KEY ("visitor_id") REFERENCES "public"."gk_analytics_visitors"("visitor_id")
          ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'gk_analytics_page_views_session_fk') THEN
        ALTER TABLE "gk_analytics_page_views"
          ADD CONSTRAINT "gk_analytics_page_views_session_fk"
          FOREIGN KEY ("session_id") REFERENCES "public"."gk_analytics_sessions"("session_id")
          ON DELETE CASCADE ON UPDATE NO ACTION;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "gk_analytics_visitors_last_seen_idx" ON "gk_analytics_visitors" ("last_seen");
    CREATE INDEX IF NOT EXISTS "gk_analytics_visitors_location_idx" ON "gk_analytics_visitors" ("country", "city");
    CREATE INDEX IF NOT EXISTS "gk_analytics_sessions_visitor_idx" ON "gk_analytics_sessions" ("visitor_id");
    CREATE INDEX IF NOT EXISTS "gk_analytics_sessions_last_seen_idx" ON "gk_analytics_sessions" ("last_seen");
    CREATE INDEX IF NOT EXISTS "gk_analytics_page_views_visitor_idx" ON "gk_analytics_page_views" ("visitor_id");
    CREATE INDEX IF NOT EXISTS "gk_analytics_page_views_session_idx" ON "gk_analytics_page_views" ("session_id");
    CREATE INDEX IF NOT EXISTS "gk_analytics_page_views_viewed_at_idx" ON "gk_analytics_page_views" ("viewed_at");
    CREATE INDEX IF NOT EXISTS "gk_analytics_page_views_path_time_idx" ON "gk_analytics_page_views" ("pathname", "viewed_at");
  `)
}

/** Intentionally non-destructive: analytics and all recorded rows are retained. */
export async function down(): Promise<void> {
  return Promise.resolve()
}
