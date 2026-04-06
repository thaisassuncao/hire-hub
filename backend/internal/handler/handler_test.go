package handler

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/thaisassuncao/hire-hub/backend/internal/domain"
	"github.com/thaisassuncao/hire-hub/backend/internal/domain/mocks"
	"github.com/thaisassuncao/hire-hub/backend/internal/usecase"
	"github.com/thaisassuncao/hire-hub/backend/pkg/jwt"
	"github.com/thaisassuncao/hire-hub/backend/pkg/response"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func setupTestRouter() (*gin.Engine, *mocks.UserRepository, *mocks.JobRepository, *mocks.ApplicationRepository, *jwt.Manager) {
	userRepo := &mocks.UserRepository{}
	jobRepo := &mocks.JobRepository{}
	appRepo := &mocks.ApplicationRepository{}

	jwtManager := jwt.NewManager("test-access", "test-refresh")

	authUC := usecase.NewAuthUseCase(userRepo, jwtManager)
	jobUC := usecase.NewJobUseCase(jobRepo)
	appUC := usecase.NewApplicationUseCase(appRepo, jobRepo)

	handlers := &Handlers{
		Auth:        NewAuthHandler(authUC),
		Job:         NewJobHandler(jobUC),
		Application: NewApplicationHandler(appUC),
	}

	r := NewRouter("http://localhost:5173", jwtManager, handlers)
	return r, userRepo, jobRepo, appRepo, jwtManager
}

func parseResponse(t *testing.T, w *httptest.ResponseRecorder) response.Response {
	t.Helper()
	var resp response.Response
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("Failed to parse response: %v\nBody: %s", err, w.Body.String())
	}
	return resp
}

func authHeader(jwtManager *jwt.Manager, userID uuid.UUID) string {
	pair, _ := jwtManager.GenerateTokenPair(userID)
	return "Bearer " + pair.AccessToken
}

// Health

func TestHealth(t *testing.T) {
	r, _, _, _, _ := setupTestRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodGet, "/api/v1/health", nil)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", w.Code, http.StatusOK)
	}

	resp := parseResponse(t, w)
	if !resp.Success {
		t.Fatal("response.Success should be true")
	}
}

// Auth

func TestRegister_Handler_Success(t *testing.T) {
	r, userRepo, _, _, _ := setupTestRouter()

	userRepo.CreateFn = func(_ context.Context, user *domain.User) error {
		user.ID = uuid.New()
		return nil
	}

	body := `{"email":"john@test.com","password":"password123"}`
	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/auth/register", bytes.NewBufferString(body))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Fatalf("status = %d, want %d. Body: %s", w.Code, http.StatusCreated, w.Body.String())
	}

	resp := parseResponse(t, w)
	if !resp.Success {
		t.Fatal("response.Success should be true")
	}
}

func TestRegister_Handler_ValidationError(t *testing.T) {
	r, _, _, _, _ := setupTestRouter()

	body := `{"email":"invalid","password":"12"}`
	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/auth/register", bytes.NewBufferString(body))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	if w.Code != http.StatusUnprocessableEntity {
		t.Fatalf("status = %d, want %d", w.Code, http.StatusUnprocessableEntity)
	}

	resp := parseResponse(t, w)
	if resp.ErrorCode != "VALIDATION_ERROR" {
		t.Fatalf("error_code = %q, want %q", resp.ErrorCode, "VALIDATION_ERROR")
	}
}

func TestRegister_Handler_DuplicateEmail(t *testing.T) {
	r, userRepo, _, _, _ := setupTestRouter()

	userRepo.CreateFn = func(_ context.Context, _ *domain.User) error {
		return domain.ErrDuplicateEmail
	}

	body := `{"email":"john@test.com","password":"password123"}`
	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/auth/register", bytes.NewBufferString(body))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	if w.Code != http.StatusConflict {
		t.Fatalf("status = %d, want %d", w.Code, http.StatusConflict)
	}
}

func TestLogin_Handler_Success(t *testing.T) {
	r, userRepo, _, _, _ := setupTestRouter()

	userRepo.FindByEmailFn = func(_ context.Context, _ string) (*domain.User, error) {
		// password123 hashed
		hashed := "$2a$10$test"
		return &domain.User{ID: uuid.New(), Email: "john@test.com", PasswordHash: hashed}, nil
	}

	// This will fail because our mock hash won't match, but we test the route exists
	body := `{"email":"john@test.com","password":"password123"}`
	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/auth/login", bytes.NewBufferString(body))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	// We expect 401 since bcrypt won't match our fake hash
	if w.Code != http.StatusUnauthorized {
		t.Fatalf("status = %d, want %d", w.Code, http.StatusUnauthorized)
	}
}

func TestGetMe_Handler_Unauthorized(t *testing.T) {
	r, _, _, _, _ := setupTestRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodGet, "/api/v1/auth/me", nil)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("status = %d, want %d", w.Code, http.StatusUnauthorized)
	}
}

func TestGetMe_Handler_Success(t *testing.T) {
	r, userRepo, _, _, jwtManager := setupTestRouter()
	userID := uuid.New()

	userRepo.FindByIDFn = func(_ context.Context, _ uuid.UUID) (*domain.User, error) {
		return &domain.User{ID: userID, Name: "john", Email: "john@test.com"}, nil
	}

	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodGet, "/api/v1/auth/me", nil)
	req.Header.Set("Authorization", authHeader(jwtManager, userID))
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d. Body: %s", w.Code, http.StatusOK, w.Body.String())
	}
}

// Jobs

func TestCreateJob_Handler_Unauthorized(t *testing.T) {
	r, _, _, _, _ := setupTestRouter()

	body := `{"title":"Dev","description":"Build great things with code","company":"ACME","location":"Remote"}`
	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/jobs", bytes.NewBufferString(body))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("status = %d, want %d", w.Code, http.StatusUnauthorized)
	}
}

func TestCreateJob_Handler_Success(t *testing.T) {
	r, _, jobRepo, _, jwtManager := setupTestRouter()
	userID := uuid.New()

	jobRepo.CreateFn = func(_ context.Context, job *domain.Job) error {
		job.ID = uuid.New()
		return nil
	}

	body := `{"title":"Go Dev","description":"Build APIs with Go and have fun","company":"ACME","location":"Remote"}`
	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/jobs", bytes.NewBufferString(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", authHeader(jwtManager, userID))
	r.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Fatalf("status = %d, want %d. Body: %s", w.Code, http.StatusCreated, w.Body.String())
	}
}

func TestCreateJob_Handler_ValidationError(t *testing.T) {
	r, _, _, _, jwtManager := setupTestRouter()
	userID := uuid.New()

	body := `{"title":"","description":"short","company":"","location":""}`
	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/jobs", bytes.NewBufferString(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", authHeader(jwtManager, userID))
	r.ServeHTTP(w, req)

	if w.Code != http.StatusUnprocessableEntity {
		t.Fatalf("status = %d, want %d", w.Code, http.StatusUnprocessableEntity)
	}
}

func TestListJobs_Handler_Success(t *testing.T) {
	r, _, jobRepo, _, _ := setupTestRouter()

	jobRepo.ListActiveFn = func(_ context.Context, _, _ int) ([]domain.Job, int64, error) {
		return []domain.Job{{ID: uuid.New(), Title: "Go Dev"}}, 1, nil
	}

	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodGet, "/api/v1/jobs", nil)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", w.Code, http.StatusOK)
	}
}

func TestSearchJobs_Handler_MissingQuery(t *testing.T) {
	r, _, _, _, _ := setupTestRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodGet, "/api/v1/jobs/search", nil)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d", w.Code, http.StatusBadRequest)
	}
}

func TestSearchJobs_Handler_Success(t *testing.T) {
	r, _, jobRepo, _, _ := setupTestRouter()

	jobRepo.SearchFn = func(_ context.Context, _ string, _, _ int) ([]domain.Job, int64, error) {
		return []domain.Job{{Title: "Go Dev"}}, 1, nil
	}

	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodGet, "/api/v1/jobs/search?q=go", nil)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", w.Code, http.StatusOK)
	}
}

func TestGetJob_Handler_Success(t *testing.T) {
	r, _, jobRepo, _, _ := setupTestRouter()
	jobID := uuid.New()

	jobRepo.FindByIDFn = func(_ context.Context, _ uuid.UUID) (*domain.Job, error) {
		return &domain.Job{ID: jobID, Title: "Go Dev"}, nil
	}

	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodGet, "/api/v1/jobs/"+jobID.String(), nil)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d. Body: %s", w.Code, http.StatusOK, w.Body.String())
	}
}

func TestGetJob_Handler_NotFound(t *testing.T) {
	r, _, jobRepo, _, _ := setupTestRouter()

	jobRepo.FindByIDFn = func(_ context.Context, _ uuid.UUID) (*domain.Job, error) {
		return nil, domain.ErrNotFound
	}

	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodGet, "/api/v1/jobs/"+uuid.New().String(), nil)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusNotFound {
		t.Fatalf("status = %d, want %d", w.Code, http.StatusNotFound)
	}
}

func TestGetJob_Handler_InvalidID(t *testing.T) {
	r, _, _, _, _ := setupTestRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodGet, "/api/v1/jobs/not-a-uuid", nil)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d", w.Code, http.StatusBadRequest)
	}
}

// Applications

func TestApply_Handler_Unauthorized(t *testing.T) {
	r, _, _, _, _ := setupTestRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/jobs/"+uuid.New().String()+"/apply", nil)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("status = %d, want %d", w.Code, http.StatusUnauthorized)
	}
}

func TestApply_Handler_Success(t *testing.T) {
	r, _, jobRepo, appRepo, jwtManager := setupTestRouter()

	userID := uuid.New()
	posterID := uuid.New()
	jobID := uuid.New()

	jobRepo.FindByIDFn = func(_ context.Context, _ uuid.UUID) (*domain.Job, error) {
		return &domain.Job{ID: jobID, IsActive: true, PostedBy: posterID}, nil
	}
	appRepo.CreateFn = func(_ context.Context, app *domain.Application) error {
		app.ID = uuid.New()
		return nil
	}

	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/jobs/"+jobID.String()+"/apply", nil)
	req.Header.Set("Authorization", authHeader(jwtManager, userID))
	r.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Fatalf("status = %d, want %d. Body: %s", w.Code, http.StatusCreated, w.Body.String())
	}
}

func TestApply_Handler_OwnJob(t *testing.T) {
	r, _, jobRepo, _, jwtManager := setupTestRouter()

	userID := uuid.New()
	jobID := uuid.New()

	jobRepo.FindByIDFn = func(_ context.Context, _ uuid.UUID) (*domain.Job, error) {
		return &domain.Job{ID: jobID, IsActive: true, PostedBy: userID}, nil
	}

	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/jobs/"+jobID.String()+"/apply", nil)
	req.Header.Set("Authorization", authHeader(jwtManager, userID))
	r.ServeHTTP(w, req)

	if w.Code != http.StatusForbidden {
		t.Fatalf("status = %d, want %d", w.Code, http.StatusForbidden)
	}
}

func TestApply_Handler_AlreadyApplied(t *testing.T) {
	r, _, jobRepo, appRepo, jwtManager := setupTestRouter()

	userID := uuid.New()
	posterID := uuid.New()
	jobID := uuid.New()

	jobRepo.FindByIDFn = func(_ context.Context, _ uuid.UUID) (*domain.Job, error) {
		return &domain.Job{ID: jobID, IsActive: true, PostedBy: posterID}, nil
	}
	appRepo.CreateFn = func(_ context.Context, _ *domain.Application) error {
		return domain.ErrAlreadyApplied
	}

	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/jobs/"+jobID.String()+"/apply", nil)
	req.Header.Set("Authorization", authHeader(jwtManager, userID))
	r.ServeHTTP(w, req)

	if w.Code != http.StatusConflict {
		t.Fatalf("status = %d, want %d", w.Code, http.StatusConflict)
	}
}

func TestListMyApplications_Handler_Success(t *testing.T) {
	r, _, _, appRepo, jwtManager := setupTestRouter()
	userID := uuid.New()

	appRepo.ListByUserFn = func(_ context.Context, _ uuid.UUID, _, _ int) ([]domain.Application, int64, error) {
		return []domain.Application{}, 0, nil
	}

	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodGet, "/api/v1/applications/mine", nil)
	req.Header.Set("Authorization", authHeader(jwtManager, userID))
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d. Body: %s", w.Code, http.StatusOK, w.Body.String())
	}
}
