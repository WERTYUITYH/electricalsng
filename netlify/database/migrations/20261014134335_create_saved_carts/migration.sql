CREATE TABLE "carts" (
	"token_hash" text PRIMARY KEY,
	"items" jsonb DEFAULT '[]' NOT NULL,
	"revision" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
