CREATE TABLE IF NOT EXISTS "words" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"word" varchar(255) NOT NULL,
	"added" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
