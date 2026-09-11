import type { MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

/**
 * Production-safe baseline for schema that previously existed only through
 * Payload's development push. Every operation is additive and idempotent.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__news_v_version_status" AS ENUM('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_avatar_url" varchar;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_avatar_width" numeric;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_avatar_height" numeric;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_avatar_mime_type" varchar;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_avatar_filesize" numeric;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_avatar_filename" varchar;

    CREATE TABLE IF NOT EXISTS "news" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar,
      "slug" varchar,
      "excerpt" varchar,
      "content" jsonb,
      "featured_image_id" integer,
      "category_id" integer,
      "published_at" timestamp(3) with time zone,
      "reading_time" numeric,
      "is_featured" boolean DEFAULT false,
      "is_breaking" boolean DEFAULT false,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "_status" "enum_news_status" DEFAULT 'draft'
    );

    CREATE TABLE IF NOT EXISTS "news_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "authors_id" integer
    );

    CREATE TABLE IF NOT EXISTS "_news_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer,
      "version_title" varchar,
      "version_slug" varchar,
      "version_excerpt" varchar,
      "version_content" jsonb,
      "version_featured_image_id" integer,
      "version_category_id" integer,
      "version_published_at" timestamp(3) with time zone,
      "version_reading_time" numeric,
      "version_is_featured" boolean DEFAULT false,
      "version_is_breaking" boolean DEFAULT false,
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "version__status" "enum__news_v_version_status" DEFAULT 'draft',
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest" boolean
    );

    CREATE TABLE IF NOT EXISTS "_news_v_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "authors_id" integer
    );

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "news_id" integer;
    ALTER TABLE "homepage_rels" ADD COLUMN IF NOT EXISTS "news_id" integer;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'news_featured_image_id_media_id_fk') THEN
        ALTER TABLE "news" ADD CONSTRAINT "news_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'news_category_id_categories_id_fk') THEN
        ALTER TABLE "news" ADD CONSTRAINT "news_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'news_rels_parent_fk') THEN
        ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'news_rels_authors_fk') THEN
        ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_news_v_parent_id_news_id_fk') THEN
        ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_news_v_version_featured_image_id_media_id_fk') THEN
        ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_news_v_version_category_id_categories_id_fk') THEN
        ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_news_v_rels_parent_fk') THEN
        ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_news_v_rels_authors_fk') THEN
        ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_news_fk') THEN
        ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'homepage_rels_news_fk') THEN
        ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "media_sizes_avatar_sizes_avatar_filename_idx" ON "media" USING btree ("sizes_avatar_filename");
    CREATE UNIQUE INDEX IF NOT EXISTS "news_slug_idx" ON "news" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "news_featured_image_idx" ON "news" USING btree ("featured_image_id");
    CREATE INDEX IF NOT EXISTS "news_category_idx" ON "news" USING btree ("category_id");
    CREATE INDEX IF NOT EXISTS "news_updated_at_idx" ON "news" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "news_created_at_idx" ON "news" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "news__status_idx" ON "news" USING btree ("_status");
    CREATE INDEX IF NOT EXISTS "news_rels_order_idx" ON "news_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "news_rels_parent_idx" ON "news_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "news_rels_path_idx" ON "news_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "news_rels_authors_id_idx" ON "news_rels" USING btree ("authors_id");
    CREATE INDEX IF NOT EXISTS "_news_v_parent_idx" ON "_news_v" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "_news_v_version_version_slug_idx" ON "_news_v" USING btree ("version_slug");
    CREATE INDEX IF NOT EXISTS "_news_v_version_version_featured_image_idx" ON "_news_v" USING btree ("version_featured_image_id");
    CREATE INDEX IF NOT EXISTS "_news_v_version_version_category_idx" ON "_news_v" USING btree ("version_category_id");
    CREATE INDEX IF NOT EXISTS "_news_v_version_version_updated_at_idx" ON "_news_v" USING btree ("version_updated_at");
    CREATE INDEX IF NOT EXISTS "_news_v_version_version_created_at_idx" ON "_news_v" USING btree ("version_created_at");
    CREATE INDEX IF NOT EXISTS "_news_v_version_version__status_idx" ON "_news_v" USING btree ("version__status");
    CREATE INDEX IF NOT EXISTS "_news_v_created_at_idx" ON "_news_v" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "_news_v_updated_at_idx" ON "_news_v" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "_news_v_latest_idx" ON "_news_v" USING btree ("latest");
    CREATE INDEX IF NOT EXISTS "_news_v_rels_order_idx" ON "_news_v_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "_news_v_rels_parent_idx" ON "_news_v_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "_news_v_rels_path_idx" ON "_news_v_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "_news_v_rels_authors_id_idx" ON "_news_v_rels" USING btree ("authors_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
    CREATE INDEX IF NOT EXISTS "homepage_rels_news_id_idx" ON "homepage_rels" USING btree ("news_id");
  `)
}

/**
 * Intentionally non-destructive. Rolling this migration down must never remove
 * existing editorial data or the schema that stores it.
 */
export async function down(): Promise<void> {
  return Promise.resolve()
}
