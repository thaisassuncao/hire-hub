package usecase

import (
	"context"
	"testing"

	"github.com/google/uuid"
	"github.com/thaisassuncao/hire-hub/backend/internal/domain"
	"github.com/thaisassuncao/hire-hub/backend/internal/domain/mocks"
)

func newAppTestSetup() (*ApplicationUseCase, *mocks.ApplicationRepository, *mocks.JobRepository) {
	appRepo := &mocks.ApplicationRepository{}
	jobRepo := &mocks.JobRepository{}
	uc := NewApplicationUseCase(appRepo, jobRepo)
	return uc, appRepo, jobRepo
}

func TestApplyToJob_Success(t *testing.T) {
	uc, appRepo, jobRepo := newAppTestSetup()

	posterID := uuid.New()
	applicantID := uuid.New()
	jobID := uuid.New()

	jobRepo.FindByIDFn = func(_ context.Context, _ uuid.UUID) (*domain.Job, error) {
		return &domain.Job{ID: jobID, IsActive: true, PostedBy: posterID}, nil
	}
	appRepo.CreateFn = func(_ context.Context, app *domain.Application) error {
		app.ID = uuid.New()
		return nil
	}

	app, err := uc.ApplyToJob(context.Background(), jobID, applicantID)
	if err != nil {
		t.Fatalf("ApplyToJob() error = %v", err)
	}
	if app == nil {
		t.Fatal("ApplyToJob() returned nil")
	}
	if app.Status != "pending" {
		t.Fatalf("app.Status = %q, want %q", app.Status, "pending")
	}
}

func TestApplyToJob_JobNotFound(t *testing.T) {
	uc, _, jobRepo := newAppTestSetup()

	jobRepo.FindByIDFn = func(_ context.Context, _ uuid.UUID) (*domain.Job, error) {
		return nil, domain.ErrNotFound
	}

	_, err := uc.ApplyToJob(context.Background(), uuid.New(), uuid.New())
	if err != domain.ErrNotFound {
		t.Fatalf("ApplyToJob() error = %v, want ErrNotFound", err)
	}
}

func TestApplyToJob_InactiveJob(t *testing.T) {
	uc, _, jobRepo := newAppTestSetup()

	jobRepo.FindByIDFn = func(_ context.Context, _ uuid.UUID) (*domain.Job, error) {
		return &domain.Job{IsActive: false, PostedBy: uuid.New()}, nil
	}

	_, err := uc.ApplyToJob(context.Background(), uuid.New(), uuid.New())
	if err != domain.ErrInactiveJob {
		t.Fatalf("ApplyToJob() error = %v, want ErrInactiveJob", err)
	}
}

func TestApplyToJob_OwnJob(t *testing.T) {
	uc, _, jobRepo := newAppTestSetup()

	userID := uuid.New()
	jobRepo.FindByIDFn = func(_ context.Context, _ uuid.UUID) (*domain.Job, error) {
		return &domain.Job{IsActive: true, PostedBy: userID}, nil
	}

	_, err := uc.ApplyToJob(context.Background(), uuid.New(), userID)
	if err != domain.ErrOwnJob {
		t.Fatalf("ApplyToJob() error = %v, want ErrOwnJob", err)
	}
}

func TestApplyToJob_AlreadyApplied(t *testing.T) {
	uc, appRepo, jobRepo := newAppTestSetup()

	posterID := uuid.New()
	applicantID := uuid.New()

	jobRepo.FindByIDFn = func(_ context.Context, _ uuid.UUID) (*domain.Job, error) {
		return &domain.Job{IsActive: true, PostedBy: posterID}, nil
	}
	appRepo.CreateFn = func(_ context.Context, _ *domain.Application) error {
		return domain.ErrAlreadyApplied
	}

	_, err := uc.ApplyToJob(context.Background(), uuid.New(), applicantID)
	if err != domain.ErrAlreadyApplied {
		t.Fatalf("ApplyToJob() error = %v, want ErrAlreadyApplied", err)
	}
}

func TestListMyApplications_Success(t *testing.T) {
	uc, appRepo, _ := newAppTestSetup()

	userID := uuid.New()
	appRepo.ListByUserFn = func(_ context.Context, _ uuid.UUID, _, _ int) ([]domain.Application, int64, error) {
		return []domain.Application{{ID: uuid.New(), UserID: userID}}, 1, nil
	}

	apps, total, err := uc.ListMyApplications(context.Background(), userID, 1, 10)
	if err != nil {
		t.Fatalf("ListMyApplications() error = %v", err)
	}
	if total != 1 {
		t.Fatalf("total = %d, want 1", total)
	}
	if len(apps) != 1 {
		t.Fatalf("len(apps) = %d, want 1", len(apps))
	}
}

func TestHasApplied_True(t *testing.T) {
	uc, appRepo, _ := newAppTestSetup()

	appRepo.FindByJobAndUserFn = func(_ context.Context, _, _ uuid.UUID) (*domain.Application, error) {
		return &domain.Application{ID: uuid.New()}, nil
	}

	applied, err := uc.HasApplied(context.Background(), uuid.New(), uuid.New())
	if err != nil {
		t.Fatalf("HasApplied() error = %v", err)
	}
	if !applied {
		t.Fatal("HasApplied() should return true")
	}
}

func TestHasApplied_False(t *testing.T) {
	uc, appRepo, _ := newAppTestSetup()

	appRepo.FindByJobAndUserFn = func(_ context.Context, _, _ uuid.UUID) (*domain.Application, error) {
		return nil, domain.ErrNotFound
	}

	applied, err := uc.HasApplied(context.Background(), uuid.New(), uuid.New())
	if err != nil {
		t.Fatalf("HasApplied() error = %v", err)
	}
	if applied {
		t.Fatal("HasApplied() should return false")
	}
}
