package usecase

import (
	"context"
	"testing"

	"github.com/google/uuid"
	"github.com/thaisassuncao/hire-hub/backend/internal/domain"
	"github.com/thaisassuncao/hire-hub/backend/internal/domain/mocks"
	"github.com/thaisassuncao/hire-hub/backend/pkg/hash"
	"github.com/thaisassuncao/hire-hub/backend/pkg/jwt"
)

func newAuthTestSetup() (*AuthUseCase, *mocks.UserRepository) {
	repo := &mocks.UserRepository{}
	jwtManager := jwt.NewManager("test-access", "test-refresh")
	uc := NewAuthUseCase(repo, jwtManager)
	return uc, repo
}

func TestRegister_Success(t *testing.T) {
	uc, repo := newAuthTestSetup()

	repo.CreateFn = func(_ context.Context, user *domain.User) error {
		user.ID = uuid.New()
		return nil
	}

	user, tokens, err := uc.Register(context.Background(), "John", "john@test.com", "password123")
	if err != nil {
		t.Fatalf("Register() error = %v", err)
	}
	if user == nil {
		t.Fatal("Register() user is nil")
	}
	if tokens == nil {
		t.Fatal("Register() tokens is nil")
	}
	if user.Name != "John" {
		t.Fatalf("user.Name = %q, want %q", user.Name, "John")
	}
	if user.PasswordHash == "" {
		t.Fatal("PasswordHash should be set")
	}
}

func TestRegister_DuplicateEmail(t *testing.T) {
	uc, repo := newAuthTestSetup()

	repo.CreateFn = func(_ context.Context, _ *domain.User) error {
		return domain.ErrDuplicateEmail
	}

	_, _, err := uc.Register(context.Background(), "John", "john@test.com", "password123")
	if err != domain.ErrDuplicateEmail {
		t.Fatalf("Register() error = %v, want ErrDuplicateEmail", err)
	}
}

func TestLogin_Success(t *testing.T) {
	uc, repo := newAuthTestSetup()

	hashed, _ := hash.HashPassword("password123")
	repo.FindByEmailFn = func(_ context.Context, _ string) (*domain.User, error) {
		return &domain.User{
			ID:           uuid.New(),
			Email:        "john@test.com",
			Name:         "John",
			PasswordHash: hashed,
		}, nil
	}

	user, tokens, err := uc.Login(context.Background(), "john@test.com", "password123")
	if err != nil {
		t.Fatalf("Login() error = %v", err)
	}
	if user == nil || tokens == nil {
		t.Fatal("Login() returned nil user or tokens")
	}
}

func TestLogin_WrongPassword(t *testing.T) {
	uc, repo := newAuthTestSetup()

	hashed, _ := hash.HashPassword("correctpassword")
	repo.FindByEmailFn = func(_ context.Context, _ string) (*domain.User, error) {
		return &domain.User{PasswordHash: hashed}, nil
	}

	_, _, err := uc.Login(context.Background(), "john@test.com", "wrongpassword")
	if err != domain.ErrInvalidCredentials {
		t.Fatalf("Login() error = %v, want ErrInvalidCredentials", err)
	}
}

func TestLogin_UserNotFound(t *testing.T) {
	uc, repo := newAuthTestSetup()

	repo.FindByEmailFn = func(_ context.Context, _ string) (*domain.User, error) {
		return nil, domain.ErrNotFound
	}

	_, _, err := uc.Login(context.Background(), "unknown@test.com", "password")
	if err != domain.ErrInvalidCredentials {
		t.Fatalf("Login() error = %v, want ErrInvalidCredentials", err)
	}
}

func TestRefreshToken_Success(t *testing.T) {
	uc, repo := newAuthTestSetup()
	userID := uuid.New()

	repo.FindByIDFn = func(_ context.Context, _ uuid.UUID) (*domain.User, error) {
		return &domain.User{ID: userID}, nil
	}

	jwtManager := jwt.NewManager("test-access", "test-refresh")
	pair, _ := jwtManager.GenerateTokenPair(userID)

	tokens, err := uc.RefreshToken(context.Background(), pair.RefreshToken)
	if err != nil {
		t.Fatalf("RefreshToken() error = %v", err)
	}
	if tokens == nil {
		t.Fatal("RefreshToken() tokens is nil")
	}
}

func TestRefreshToken_InvalidToken(t *testing.T) {
	uc, _ := newAuthTestSetup()

	_, err := uc.RefreshToken(context.Background(), "invalid-token")
	if err != domain.ErrInvalidToken {
		t.Fatalf("RefreshToken() error = %v, want ErrInvalidToken", err)
	}
}

func TestGetMe_Success(t *testing.T) {
	uc, repo := newAuthTestSetup()
	userID := uuid.New()

	repo.FindByIDFn = func(_ context.Context, id uuid.UUID) (*domain.User, error) {
		return &domain.User{ID: id, Name: "John"}, nil
	}

	user, err := uc.GetMe(context.Background(), userID)
	if err != nil {
		t.Fatalf("GetMe() error = %v", err)
	}
	if user.ID != userID {
		t.Fatalf("user.ID = %v, want %v", user.ID, userID)
	}
}

func TestGetMe_NotFound(t *testing.T) {
	uc, repo := newAuthTestSetup()

	repo.FindByIDFn = func(_ context.Context, _ uuid.UUID) (*domain.User, error) {
		return nil, domain.ErrNotFound
	}

	_, err := uc.GetMe(context.Background(), uuid.New())
	if err != domain.ErrNotFound {
		t.Fatalf("GetMe() error = %v, want ErrNotFound", err)
	}
}
