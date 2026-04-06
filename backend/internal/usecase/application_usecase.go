package usecase

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/thaisassuncao/hire-hub/backend/internal/domain"
)

type ApplicationUseCase struct {
	appRepo domain.ApplicationRepository
	jobRepo domain.JobRepository
}

func NewApplicationUseCase(appRepo domain.ApplicationRepository, jobRepo domain.JobRepository) *ApplicationUseCase {
	return &ApplicationUseCase{
		appRepo: appRepo,
		jobRepo: jobRepo,
	}
}

func (uc *ApplicationUseCase) ApplyToJob(ctx context.Context, jobID, userID uuid.UUID) (*domain.Application, error) {
	job, err := uc.jobRepo.FindByID(ctx, jobID)
	if err != nil {
		return nil, err
	}

	if !job.IsActive {
		return nil, domain.ErrInactiveJob
	}

	if job.PostedBy == userID {
		return nil, domain.ErrOwnJob
	}

	app := &domain.Application{
		JobID:  jobID,
		UserID: userID,
		Status: "pending",
	}

	if err := uc.appRepo.Create(ctx, app); err != nil {
		return nil, err
	}

	return app, nil
}

func (uc *ApplicationUseCase) ListMyApplications(ctx context.Context, userID uuid.UUID, page, pageSize int) ([]domain.Application, int64, error) {
	return uc.appRepo.ListByUser(ctx, userID, page, pageSize)
}

func (uc *ApplicationUseCase) HasApplied(ctx context.Context, jobID, userID uuid.UUID) (bool, error) {
	_, err := uc.appRepo.FindByJobAndUser(ctx, jobID, userID)
	if err != nil {
		if errors.Is(err, domain.ErrNotFound) {
			return false, nil
		}
		return false, err
	}
	return true, nil
}
