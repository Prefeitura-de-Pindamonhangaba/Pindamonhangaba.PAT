CREATE TABLE "sessions" (
	"digest" text PRIMARY KEY NOT NULL,
	"subject" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "publication" (
	"id" integer PRIMARY KEY NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "publication_singleton" CHECK ("publication"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE "vacancies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"occupation" varchar(200) NOT NULL,
	"openings" integer NOT NULL,
	"education" varchar(200) DEFAULT '' NOT NULL,
	"experience" varchar(200) DEFAULT '' NOT NULL,
	"notes" varchar(1000) DEFAULT '' NOT NULL,
	"filled" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vacancies_positive_openings" CHECK ("vacancies"."openings" > 0)
);
--> statement-breakpoint
CREATE INDEX "sessions_expiration_idx" ON "sessions" USING btree ("expires_at");