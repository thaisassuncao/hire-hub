package usecase

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/thaisassuncao/hire-hub/backend/internal/domain"
	"github.com/thaisassuncao/hire-hub/backend/pkg/hash"
	"github.com/thaisassuncao/hire-hub/backend/pkg/jwt"
)

type AuthUseCase struct {
	userRepo domain.UserRepository
	jwt      *jwt.Manager
}

func NewAuthUseCase(userRepo domain.UserRepository, jwtManager *jwt.Manager) *AuthUseCase {
	return &AuthUseCase{
		userRepo: userRepo,
		jwt:      jwtManager,
	}
}

func (uc *AuthUseCase) Register(ctx context.Context, name, email, password string) (*domain.User, *jwt.TokenPair, error) {
	passwordHash, err := hash.HashPassword(password)
	if err != nil {
		return nil, nil, err
	}

	user := &domain.User{
		Name:         name,
		Email:        email,
		PasswordHash: passwordHash,
	}

	if err := uc.userRepo.Create(ctx, user); err != nil {
		return nil, nil, err
	}

	tokens, err := uc.jwt.GenerateTokenPair(user.ID)
	if err != nil {
		return nil, nil, err
	}

	return user, tokens, nil
}

func (uc *AuthUseCase) Login(ctx context.Context, email, password string) (*domain.User, *jwt.TokenPair, error) {
	user, err := uc.userRepo.FindByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, domain.ErrNotFound) {
			return nil, nil, domain.ErrInvalidCredentials
		}
		return nil, nil, err
	}

	if !hash.CheckPassword(password, user.PasswordHash) {
		return nil, nil, domain.ErrInvalidCredentials
	}

	tokens, err := uc.jwt.GenerateTokenPair(user.ID)
	if err != nil {
		return nil, nil, err
	}

	return user, tokens, nil
}

func (uc *AuthUseCase) RefreshToken(ctx context.Context, refreshToken string) (*jwt.TokenPair, error) {
	claims, err := uc.jwt.ValidateRefreshToken(refreshToken)
	if err != nil {
		return nil, domain.ErrInvalidToken
	}

	if _, err := uc.userRepo.FindByID(ctx, claims.UserID); err != nil {
		return nil, err
	}

	tokens, err := uc.jwt.GenerateTokenPair(claims.UserID)
	if err != nil {
		return nil, err
	}

	return tokens, nil
}

func (uc *AuthUseCase) GetMe(ctx context.Context, userID uuid.UUID) (*domain.User, error) {
	return uc.userRepo.FindByID(ctx, userID)
}
