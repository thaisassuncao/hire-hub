package repository

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/thaisassuncao/hire-hub/backend/internal/domain"
	"gorm.io/gorm"
)

type ApplicationRepository struct {
	db *gorm.DB
}

func NewApplicationRepository(db *gorm.DB) *ApplicationRepository {
	return &ApplicationRepository{db: db}
}

func (r *ApplicationRepository) Create(ctx context.Context, application *domain.Application) error {
	if err := r.db.WithContext(ctx).Create(application).Error; err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			return domain.ErrAlreadyApplied
		}
		return err
	}
	return nil
}

func (r *ApplicationRepository) FindByJobAndUser(ctx context.Context, jobID, userID uuid.UUID) (*domain.Application, error) {
	var app domain.Application
	if err := r.db.WithContext(ctx).First(&app, "job_id = ? AND user_id = ?", jobID, userID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, domain.ErrNotFound
		}
		return nil, err
	}
	return &app, nil
}

func (r *ApplicationRepository) ListByUser(ctx context.Context, userID uuid.UUID, page, pageSize int) ([]domain.Application, int64, error) {
	var apps []domain.Application
	var total int64

	query := r.db.WithContext(ctx).Model(&domain.Application{}).Where("user_id = ?", userID)

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * pageSize
	if err := query.Preload("Job").Offset(offset).Limit(pageSize).Order("created_at DESC").Find(&apps).Error; err != nil {
		return nil, 0, err
	}

	return apps, total, nil
}
