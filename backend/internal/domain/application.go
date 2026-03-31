package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type Application struct {
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	JobID     uuid.UUID `gorm:"type:uuid;not null;uniqueIndex:idx_job_user" json:"job_id"`
	Job       *Job      `gorm:"foreignKey:JobID" json:"job,omitempty"`
	UserID    uuid.UUID `gorm:"type:uuid;not null;uniqueIndex:idx_job_user" json:"user_id"`
	User      *User     `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Status    string    `gorm:"type:varchar(50);default:'pending'" json:"status"`
	CreatedAt time.Time `gorm:"not null" json:"created_at"`
	UpdatedAt time.Time `gorm:"not null" json:"updated_at"`
}

type ApplicationRepository interface {
	Create(ctx context.Context, application *Application) error
	FindByJobAndUser(ctx context.Context, jobID, userID uuid.UUID) (*Application, error)
	ListByUser(ctx context.Context, userID uuid.UUID, page, pageSize int) ([]Application, int64, error)
}
