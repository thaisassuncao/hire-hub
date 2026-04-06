package handler

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/thaisassuncao/hire-hub/backend/internal/domain"
	"github.com/thaisassuncao/hire-hub/backend/internal/usecase"
	"github.com/thaisassuncao/hire-hub/backend/pkg/response"
)

type ApplicationHandler struct {
	appUC *usecase.ApplicationUseCase
}

func NewApplicationHandler(appUC *usecase.ApplicationUseCase) *ApplicationHandler {
	return &ApplicationHandler{appUC: appUC}
}

func (h *ApplicationHandler) Apply(c *gin.Context) {
	jobID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid job ID")
		return
	}

	userID := c.MustGet("user_id").(uuid.UUID)

	app, err := h.appUC.ApplyToJob(c.Request.Context(), jobID, userID)
	if err != nil {
		switch {
		case errors.Is(err, domain.ErrNotFound):
			response.Error(c, http.StatusNotFound, "NOT_FOUND", "Job not found")
		case errors.Is(err, domain.ErrInactiveJob):
			response.Error(c, http.StatusBadRequest, "INACTIVE_JOB", "Job is no longer accepting applications")
		case errors.Is(err, domain.ErrOwnJob):
			response.Error(c, http.StatusForbidden, "OWN_JOB", "Cannot apply to a job you posted")
		case errors.Is(err, domain.ErrAlreadyApplied):
			response.Error(c, http.StatusConflict, "ALREADY_APPLIED", "You already applied to this job")
		default:
			response.Error(c, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to apply")
		}
		return
	}

	response.OK(c, http.StatusCreated, gin.H{"application": app})
}

func (h *ApplicationHandler) CheckApplied(c *gin.Context) {
	jobID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid job ID")
		return
	}

	userID := c.MustGet("user_id").(uuid.UUID)

	applied, err := h.appUC.HasApplied(c.Request.Context(), jobID, userID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to check application status")
		return
	}

	response.OK(c, http.StatusOK, gin.H{"applied": applied})
}

func (h *ApplicationHandler) ListMine(c *gin.Context) {
	userID := c.MustGet("user_id").(uuid.UUID)
	page, pageSize := parsePagination(c)

	apps, total, err := h.appUC.ListMyApplications(c.Request.Context(), userID, page, pageSize)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to list applications")
		return
	}

	response.OK(c, http.StatusOK, gin.H{
		"applications": apps,
		"total":        total,
		"page":         page,
	})
}
