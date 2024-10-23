CREATE TYPE "public"."status" AS ENUM('open', 'paid', 'void', 'uncollected');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"createTs" timestamp DEFAULT now() NOT NULL,
	"status" "status" NOT NULL,
	"value" integer NOT NULL,
	"description" text NOT NULL
);
