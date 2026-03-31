package domain

import "errors"

var (
	ErrNotFound           = errors.New("resource not found")
	ErrDuplicateEmail     = errors.New("email already registered")
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrAlreadyApplied     = errors.New("already applied to this job")
	ErrOwnJob             = errors.New("cannot apply to own job")
	ErrInactiveJob        = errors.New("job is no longer active")
	ErrExpiredToken       = errors.New("token has expired")
	ErrInvalidToken       = errors.New("token is invalid")
)
