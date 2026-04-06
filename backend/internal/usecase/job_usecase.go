package usecase

import (
	"context"

	"github.com/google/uuid"
	"github.com/thaisassuncao/hire-hub/backend/internal/domain"
)

type JobUseCase struct {
	jobRepo domain.JobRepository
}

func NewJobUseCase(jobRepo domain.JobRepository) *JobUseCase {
	return &JobUseCase{jobRepo: jobRepo}
}

func (uc *JobUseCase) CreateJob(ctx context.Context, userID uuid.UUID, title, description, company, location string, salaryMin, salaryMax *int) (*domain.Job, error) {
	job := &domain.Job{
		Title:       title,
		Description: description,
		Company:     company,
		Location:    location,
		SalaryMin:   salaryMin,
		SalaryMax:   salaryMax,
		IsActive:    true,
		PostedBy:    userID,
	}

	if err := uc.jobRepo.Create(ctx, job); err != nil {
		return nil, err
	}

	return job, nil
}

func (uc *JobUseCase) GetJob(ctx context.Context, id uuid.UUID) (*domain.Job, error) {
	return uc.jobRepo.FindByID(ctx, id)
}

func (uc *JobUseCase) ListJobs(ctx context.Context, page, pageSize int) ([]domain.Job, int64, error) {
	return uc.jobRepo.ListActive(ctx, page, pageSize)
}

func (uc *JobUseCase) SearchJobs(ctx context.Context, query string, page, pageSize int) ([]domain.Job, int64, error) {
	return uc.jobRepo.Search(ctx, query, page, pageSize)
}

func (uc *JobUseCase) ListMyJobs(ctx context.Context, userID uuid.UUID, page, pageSize int) ([]domain.Job, int64, error) {
	return uc.jobRepo.ListByUser(ctx, userID, page, pageSize)
}

func (uc *JobUseCase) CloseJob(ctx context.Context, jobID, userID uuid.UUID) error {
	job, err := uc.jobRepo.FindByID(ctx, jobID)
	if err != nil {
		return err
	}

	if job.PostedBy != userID {
		return domain.ErrNotOwner
	}

	return uc.jobRepo.CloseJob(ctx, jobID, userID)
}

func (uc *JobUseCase) UpdateJob(ctx context.Context, jobID, userID uuid.UUID, title, description, company, location string, salaryMin, salaryMax *int) (*domain.Job, error) {
	job, err := uc.jobRepo.FindByID(ctx, jobID)
	if err != nil {
		return nil, err
	}

	if job.PostedBy != userID {
		return nil, domain.ErrNotOwner
	}

	if title != "" {
		job.Title = title
	}
	if description != "" {
		job.Description = description
	}
	if company != "" {
		job.Company = company
	}
	if location != "" {
		job.Location = location
	}
	job.SalaryMin = salaryMin
	job.SalaryMax = salaryMax

	if err := uc.jobRepo.UpdateJob(ctx, job); err != nil {
		return nil, err
	}

	return job, nil
}

func (uc *JobUseCase) DeleteJob(ctx context.Context, jobID, userID uuid.UUID) error {
	job, err := uc.jobRepo.FindByID(ctx, jobID)
	if err != nil {
		return err
	}

	if job.PostedBy != userID {
		return domain.ErrNotOwner
	}

	return uc.jobRepo.DeleteJob(ctx, jobID, userID)
}
