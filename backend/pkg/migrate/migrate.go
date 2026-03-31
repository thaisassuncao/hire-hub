package migrate

import (
	"errors"
	"fmt"
	"log"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func Run(databaseURL, migrationsPath string) error {
	source := fmt.Sprintf("file://%s", migrationsPath)

	m, err := migrate.New(source, databaseURL)
	if err != nil {
		return fmt.Errorf("failed to create migrate instance: %w", err)
	}
	defer func() { _, _ = m.Close() }()

	if err := m.Up(); err != nil && !errors.Is(err, migrate.ErrNoChange) {
		return fmt.Errorf("failed to run migrations: %w", err)
	}

	log.Println("Migrations applied successfully")
	return nil
}
