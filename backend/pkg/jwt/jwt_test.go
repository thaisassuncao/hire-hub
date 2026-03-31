package jwt

import (
	"testing"
	"time"

	"github.com/google/uuid"
)

func newTestManager() *Manager {
	return NewManager("test-access-secret", "test-refresh-secret")
}

func TestGenerateTokenPair(t *testing.T) {
	m := newTestManager()
	userID := uuid.New()

	pair, err := m.GenerateTokenPair(userID)
	if err != nil {
		t.Fatalf("GenerateTokenPair() error = %v", err)
	}

	if pair.AccessToken == "" {
		t.Fatal("AccessToken is empty")
	}
	if pair.RefreshToken == "" {
		t.Fatal("RefreshToken is empty")
	}
	if pair.AccessToken == pair.RefreshToken {
		t.Fatal("AccessToken and RefreshToken should be different")
	}
}

func TestValidateAccessToken(t *testing.T) {
	m := newTestManager()
	userID := uuid.New()

	pair, _ := m.GenerateTokenPair(userID)

	claims, err := m.ValidateAccessToken(pair.AccessToken)
	if err != nil {
		t.Fatalf("ValidateAccessToken() error = %v", err)
	}

	if claims.UserID != userID {
		t.Fatalf("UserID = %v, want %v", claims.UserID, userID)
	}
}

func TestValidateRefreshToken(t *testing.T) {
	m := newTestManager()
	userID := uuid.New()

	pair, _ := m.GenerateTokenPair(userID)

	claims, err := m.ValidateRefreshToken(pair.RefreshToken)
	if err != nil {
		t.Fatalf("ValidateRefreshToken() error = %v", err)
	}

	if claims.UserID != userID {
		t.Fatalf("UserID = %v, want %v", claims.UserID, userID)
	}
}

func TestAccessTokenCannotBeValidatedAsRefresh(t *testing.T) {
	m := newTestManager()
	userID := uuid.New()

	pair, _ := m.GenerateTokenPair(userID)

	_, err := m.ValidateRefreshToken(pair.AccessToken)
	if err == nil {
		t.Fatal("Access token should not be valid as refresh token")
	}
}

func TestRefreshTokenCannotBeValidatedAsAccess(t *testing.T) {
	m := newTestManager()
	userID := uuid.New()

	pair, _ := m.GenerateTokenPair(userID)

	_, err := m.ValidateAccessToken(pair.RefreshToken)
	if err == nil {
		t.Fatal("Refresh token should not be valid as access token")
	}
}

func TestInvalidTokenString(t *testing.T) {
	m := newTestManager()

	_, err := m.ValidateAccessToken("invalid-token")
	if err == nil {
		t.Fatal("Should return error for invalid token")
	}
}

func TestExpiredToken(t *testing.T) {
	m := &Manager{
		accessSecret:  []byte("secret"),
		refreshSecret: []byte("secret2"),
		accessTTL:     -1 * time.Second,
		refreshTTL:    7 * 24 * time.Hour,
	}

	userID := uuid.New()
	pair, _ := m.GenerateTokenPair(userID)

	_, err := m.ValidateAccessToken(pair.AccessToken)
	if err == nil {
		t.Fatal("Should return error for expired token")
	}
}
