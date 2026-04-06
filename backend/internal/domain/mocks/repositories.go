package mocks

import (
	"context"

	"github.com/google/uuid"
	"github.com/thaisassuncao/hire-hub/backend/internal/domain"
)

// UserRepository mock

type UserRepository struct {
	CreateFn      func(ctx context.Context, user *domain.User) error
	FindByIDFn    func(ctx context.Context, id uuid.UUID) (*domain.User, error)
	FindByEmailFn func(ctx context.Context, email string) (*domain.User, error)
}

func (m *UserRepository) Create(ctx context.Context, user *domain.User) error {
	return m.CreateFn(ctx, user)
}

func (m *UserRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.User, error) {
	return m.FindByIDFn(ctx, id)
}

func (m *UserRepository) FindByEmail(ctx context.Context, email string) (*domain.User, error) {
	return m.FindByEmailFn(ctx, email)
}

// JobRepository mock

type JobRepository struct {
	CreateFn     func(ctx context.Context, job *domain.Job) error
	FindByIDFn   func(ctx context.Context, id uuid.UUID) (*domain.Job, error)
	ListActiveFn func(ctx context.Context, page, pageSize int) ([]domain.Job, int64, error)
	SearchFn     func(ctx context.Context, query string, page, pageSize int) ([]domain.Job, int64, error)
	ListByUserFn func(ctx context.Context, userID uuid.UUID, page, pageSize int) ([]domain.Job, int64, error)
	CloseJobFn   func(ctx context.Context, id, userID uuid.UUID) error
}

func (m *JobRepository) Create(ctx context.Context, job *domain.Job) error {
	return m.CreateFn(ctx, job)
}

func (m *JobRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.Job, error) {
	return m.FindByIDFn(ctx, id)
}

func (m *JobRepository) ListActive(ctx context.Context, page, pageSize int) ([]domain.Job, int64, error) {
	return m.ListActiveFn(ctx, page, pageSize)
}

func (m *JobRepository) Search(ctx context.Context, query string, page, pageSize int) ([]domain.Job, int64, error) {
	return m.SearchFn(ctx, query, page, pageSize)
}

func (m *JobRepository) ListByUser(ctx context.Context, userID uuid.UUID, page, pageSize int) ([]domain.Job, int64, error) {
	return m.ListByUserFn(ctx, userID, page, pageSize)
}

func (m *JobRepository) CloseJob(ctx context.Context, id, userID uuid.UUID) error {
	return m.CloseJobFn(ctx, id, userID)
}

// ApplicationRepository mock

type ApplicationRepository struct {
	CreateFn          func(ctx context.Context, application *domain.Application) error
	FindByJobAndUserFn func(ctx context.Context, jobID, userID uuid.UUID) (*domain.Application, error)
	ListByUserFn      func(ctx context.Context, userID uuid.UUID, page, pageSize int) ([]domain.Application, int64, error)
}

func (m *ApplicationRepository) Create(ctx context.Context, application *domain.Application) error {
	return m.CreateFn(ctx, application)
}

func (m *ApplicationRepository) FindByJobAndUser(ctx context.Context, jobID, userID uuid.UUID) (*domain.Application, error) {
	return m.FindByJobAndUserFn(ctx, jobID, userID)
}

func (m *ApplicationRepository) ListByUser(ctx context.Context, userID uuid.UUID, page, pageSize int) ([]domain.Application, int64, error) {
	return m.ListByUserFn(ctx, userID, page, pageSize)
}
