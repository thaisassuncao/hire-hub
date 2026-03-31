package hash

import (
	"testing"
)

func TestHashPassword(t *testing.T) {
	password := "mysecretpassword"

	hashed, err := HashPassword(password)
	if err != nil {
		t.Fatalf("HashPassword() error = %v", err)
	}

	if hashed == "" {
		t.Fatal("HashPassword() returned empty string")
	}

	if hashed == password {
		t.Fatal("HashPassword() returned plaintext password")
	}
}

func TestCheckPassword(t *testing.T) {
	password := "mysecretpassword"
	hashed, _ := HashPassword(password)

	if !CheckPassword(password, hashed) {
		t.Fatal("CheckPassword() should return true for correct password")
	}

	if CheckPassword("wrongpassword", hashed) {
		t.Fatal("CheckPassword() should return false for wrong password")
	}
}

func TestHashPasswordUniqueness(t *testing.T) {
	password := "samepassword"

	hash1, _ := HashPassword(password)
	hash2, _ := HashPassword(password)

	if hash1 == hash2 {
		t.Fatal("HashPassword() should generate different hashes for the same password (different salts)")
	}
}
