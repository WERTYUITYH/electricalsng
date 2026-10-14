CREATE TABLE "selling_prices" (
	"product_id" text PRIMARY KEY,
	"price_ngn" integer NOT NULL,
	"availability" text DEFAULT 'Confirm availability' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
