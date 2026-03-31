package usecase

import (
	"context"
	"testing"

	"github.com/google/uuid"
	"github.com/thaisassuncao/hire-hub/backend/internal/domain"
	"github.com/thaisassuncao/hire-hub/backend/internal/domain/mocks"
)

func newJobTestSetup() (*JobUseCase, *mocks.JobRepository) {
	repo := &mocks.JobRepository{}
	uc := NewJobUseCase(repo)
	return uc, repo
}

func TestCreateJob_Success(t *testing.T) {
	uc, repo := newJobTestSetup()

	repo.CreateFn = func(_ context.Context, job *domain.Job) error {
		job.ID = uuid.New()
		return nil
	}

	userID := uuid.New()
	job, err := uc.CreateJob(context.Background(), userID, "Go Dev", "Build APIs", "ACME", "Remote", nil, nil)
	if err != nil {
		t.Fatalf("CreateJob() error = %v", err)
	}
	if job == nil {
		t.Fatal("CreateJob() returned nil")
	}
	if job.Title != "Go Dev" {
		t.Fatalf("job.Title = %q, want %q", job.Title, "Go Dev")
	}
	if job.PostedBy != userID {
		t.Fatalf("job.PostedBy = %v, want %v", job.PostedBy, userID)
	}
	if !job.IsActive {
		t.Fatal("job.IsActive should be true")
	}
}

func TestCreateJob_WithSalary(t *testing.T) {
	uc, repo := newJobTestSetup()

	repo.CreateFn = func(_ context.Context, job *domain.Job) error {
		job.ID = uuid.New()
		return nil
	}

	min, max := 5000, 10000
	job, err := uc.CreateJob(context.Background(), uuid.New(), "Dev", "Build stuff", "Co", "SP", &min, &max)
	if err != nil {
		t.Fatalf("CreateJob() error = %v", err)
	}
	if job.SalaryMin == nil || *job.SalaryMin != 5000 {
		t.Fatalf("SalaryMin = %v, want 5000", job.SalaryMin)
	}
	if job.SalaryMax == nil || *job.SalaryMax != 10000 {
		t.Fatalf("SalaryMax = %v, want 10000", job.SalaryMax)
	}
}

func TestGetJob_Success(t *testing.T) {
	uc, repo := newJobTestSetup()
	jobID := uuid.New()

	repo.FindByIDFn = func(_ context.Context, id uuid.UUID) (*domain.Job, error) {
		return &domain.Job{ID: id, Title: "Go Dev"}, nil
	}

	job, err := uc.GetJob(context.Background(), jobID)
	if err != nil {
		t.Fatalf("GetJob() error = %v", err)
	}
	if job.ID != jobID {
		t.Fatalf("job.ID = %v, want %v", job.ID, jobID)
	}
}

func TestGetJob_NotFound(t *testing.T) {
	uc, repo := newJobTestSetup()

	repo.FindByIDFn = func(_ context.Context, _ uuid.UUID) (*domain.Job, error) {
		return nil, domain.ErrNotFound
	}

	_, err := uc.GetJob(context.Background(), uuid.New())
	if err != domain.ErrNotFound {
		t.Fatalf("GetJob() error = %v, want ErrNotFound", err)
	}
}

func TestListJobs_Success(t *testing.T) {
	uc, repo := newJobTestSetup()

	repo.ListActiveFn = func(_ context.Context, _, _ int) ([]domain.Job, int64, error) {
		return []domain.Job{{Title: "Job1"}, {Title: "Job2"}}, 2, nil
	}

	jobs, total, err := uc.ListJobs(context.Background(), 1, 10)
	if err != nil {
		t.Fatalf("ListJobs() error = %v", err)
	}
	if total != 2 {
		t.Fatalf("total = %d, want 2", total)
	}
	if len(jobs) != 2 {
		t.Fatalf("len(jobs) = %d, want 2", len(jobs))
	}
}

func TestSearchJobs_Success(t *testing.T) {
	uc, repo := newJobTestSetup()

	repo.SearchFn = func(_ context.Context, q string, _, _ int) ([]domain.Job, int64, error) {
		if q == "golang" {
			return []domain.Job{{Title: "Go Dev"}}, 1, nil
		}
		return nil, 0, nil
	}

	jobs, total, err := uc.SearchJobs(context.Background(), "golang", 1, 10)
	if err != nil {
		t.Fatalf("SearchJobs() error = %v", err)
	}
	if total != 1 {
		t.Fatalf("total = %d, want 1", total)
	}
	if len(jobs) != 1 {
		t.Fatalf("len(jobs) = %d, want 1", len(jobs))
	}
}

func TestListMyJobs_Success(t *testing.T) {
	uc, repo := newJobTestSetup()
	userID := uuid.New()

	repo.ListByUserFn = func(_ context.Context, _ uuid.UUID, _, _ int) ([]domain.Job, int64, error) {
		return []domain.Job{{PostedBy: userID}}, 1, nil
	}

	jobs, total, err := uc.ListMyJobs(context.Background(), userID, 1, 10)
	if err != nil {
		t.Fatalf("ListMyJobs() error = %v", err)
	}
	if total != 1 {
		t.Fatalf("total = %d, want 1", total)
	}
	if len(jobs) != 1 {
		t.Fatalf("len(jobs) = %d, want 1", len(jobs))
	}
}
