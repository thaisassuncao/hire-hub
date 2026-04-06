package repository

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/thaisassuncao/hire-hub/backend/internal/domain"
	"gorm.io/gorm"
)

type JobRepository struct {
	db *gorm.DB
}

func NewJobRepository(db *gorm.DB) *JobRepository {
	return &JobRepository{db: db}
}

func (r *JobRepository) Create(ctx context.Context, job *domain.Job) error {
	return r.db.WithContext(ctx).Create(job).Error
}

func (r *JobRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.Job, error) {
	var job domain.Job
	if err := r.db.WithContext(ctx).Preload("PostedByUser").First(&job, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, domain.ErrNotFound
		}
		return nil, err
	}
	return &job, nil
}

func (r *JobRepository) ListActive(ctx context.Context, page, pageSize int) ([]domain.Job, int64, error) {
	var jobs []domain.Job
	var total int64

	query := r.db.WithContext(ctx).Model(&domain.Job{}).Where("is_active = ?", true)

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * pageSize
	if err := query.Offset(offset).Limit(pageSize).Order("created_at DESC").Find(&jobs).Error; err != nil {
		return nil, 0, err
	}

	return jobs, total, nil
}

func (r *JobRepository) Search(ctx context.Context, q string, page, pageSize int) ([]domain.Job, int64, error) {
	var jobs []domain.Job
	var total int64

	pattern := "%" + q + "%"
	query := r.db.WithContext(ctx).Model(&domain.Job{}).
		Where("is_active = ? AND (title ILIKE ? OR description ILIKE ? OR company ILIKE ?)", true, pattern, pattern, pattern)

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * pageSize
	if err := query.Offset(offset).Limit(pageSize).Order("created_at DESC").Find(&jobs).Error; err != nil {
		return nil, 0, err
	}

	return jobs, total, nil
}

func (r *JobRepository) ListByUser(ctx context.Context, userID uuid.UUID, page, pageSize int) ([]domain.Job, int64, error) {
	var jobs []domain.Job
	var total int64

	query := r.db.WithContext(ctx).Model(&domain.Job{}).Where("posted_by = ?", userID)

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * pageSize
	if err := query.Offset(offset).Limit(pageSize).Order("created_at DESC").Find(&jobs).Error; err != nil {
		return nil, 0, err
	}

	return jobs, total, nil
}

func (r *JobRepository) CloseJob(ctx context.Context, id, userID uuid.UUID) error {
	result := r.db.WithContext(ctx).
		Model(&domain.Job{}).
		Where("id = ? AND posted_by = ?", id, userID).
		Update("is_active", false)

	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return domain.ErrNotFound
	}
	return nil
}

func (r *JobRepository) UpdateJob(ctx context.Context, job *domain.Job) error {
	return r.db.WithContext(ctx).Save(job).Error
}

func (r *JobRepository) DeleteJob(ctx context.Context, id, userID uuid.UUID) error {
	result := r.db.WithContext(ctx).
		Where("id = ? AND posted_by = ?", id, userID).
		Delete(&domain.Job{})

	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return domain.ErrNotFound
	}
	return nil
}
