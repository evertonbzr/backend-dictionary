CREATE TABLE IF NOT EXISTS "words" (
	"id" serial PRIMARY KEY NOT NULL,
	"cuid" varchar(36),
	"word" varchar(255) NOT NULL,
	"added" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
