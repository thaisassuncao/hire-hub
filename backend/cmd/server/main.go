package main

import (
	"log"

	"github.com/thaisassuncao/hire-hub/backend/internal/config"
	"github.com/thaisassuncao/hire-hub/backend/internal/handler"
	"github.com/thaisassuncao/hire-hub/backend/pkg/migrate"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	if err := migrate.Run(cfg.DatabaseURL, "migrations"); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	db, err := gorm.Open(postgres.Open(cfg.DatabaseURL), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	_ = db // will be used for dependency injection in later phases

	r := handler.NewRouter(cfg.CORSOrigin)

	log.Printf("Server starting on port %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
