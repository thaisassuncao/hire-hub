package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type Job struct {
	ID          uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	Title       string    `gorm:"type:varchar(255);not null" json:"title"`
	Description string    `gorm:"type:text;not null" json:"description"`
	Company     string    `gorm:"type:varchar(255);not null" json:"company"`
	Location    string    `gorm:"type:varchar(255);not null" json:"location"`
	SalaryMin   *int      `gorm:"type:integer" json:"salary_min,omitempty"`
	SalaryMax   *int      `gorm:"type:integer" json:"salary_max,omitempty"`
	IsActive    bool      `gorm:"default:true" json:"is_active"`
	PostedBy    uuid.UUID `gorm:"type:uuid;not null" json:"posted_by"`
	PostedByUser *User    `gorm:"foreignKey:PostedBy" json:"posted_by_user,omitempty"`
	CreatedAt   time.Time `gorm:"not null" json:"created_at"`
	UpdatedAt   time.Time `gorm:"not null" json:"updated_at"`
}

type JobRepository interface {
	Create(ctx context.Context, job *Job) error
	FindByID(ctx context.Context, id uuid.UUID) (*Job, error)
	ListActive(ctx context.Context, page, pageSize int) ([]Job, int64, error)
	Search(ctx context.Context, query string, page, pageSize int) ([]Job, int64, error)
	ListByUser(ctx context.Context, userID uuid.UUID, page, pageSize int) ([]Job, int64, error)
}
