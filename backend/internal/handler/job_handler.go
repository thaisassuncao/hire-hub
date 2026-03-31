package handler

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/thaisassuncao/hire-hub/backend/internal/domain"
	"github.com/thaisassuncao/hire-hub/backend/internal/usecase"
	"github.com/thaisassuncao/hire-hub/backend/pkg/response"
)

type JobHandler struct {
	jobUC *usecase.JobUseCase
}

func NewJobHandler(jobUC *usecase.JobUseCase) *JobHandler {
	return &JobHandler{jobUC: jobUC}
}

type createJobRequest struct {
	Title       string `json:"title" binding:"required,min=2,max=255"`
	Description string `json:"description" binding:"required,min=10"`
	Company     string `json:"company" binding:"required,min=2,max=255"`
	Location    string `json:"location" binding:"required,min=2,max=255"`
	SalaryMin   *int   `json:"salary_min" binding:"omitempty,min=0"`
	SalaryMax   *int   `json:"salary_max" binding:"omitempty,min=0"`
}

func (h *JobHandler) Create(c *gin.Context) {
	var req createJobRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ErrorWithDetails(c, http.StatusUnprocessableEntity, "VALIDATION_ERROR", "Invalid request body", err.Error())
		return
	}

	userID := c.MustGet("user_id").(uuid.UUID)

	job, err := h.jobUC.CreateJob(c.Request.Context(), userID, req.Title, req.Description, req.Company, req.Location, req.SalaryMin, req.SalaryMax)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to create job")
		return
	}

	response.OK(c, http.StatusCreated, gin.H{"job": job})
}

func (h *JobHandler) GetByID(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.Error(c, http.StatusBadRequest, "VALIDATION_ERROR", "Invalid job ID")
		return
	}

	job, err := h.jobUC.GetJob(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, domain.ErrNotFound) {
			response.Error(c, http.StatusNotFound, "NOT_FOUND", "Job not found")
			return
		}
		response.Error(c, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to get job")
		return
	}

	response.OK(c, http.StatusOK, gin.H{"job": job})
}

func (h *JobHandler) List(c *gin.Context) {
	page, pageSize := parsePagination(c)

	jobs, total, err := h.jobUC.ListJobs(c.Request.Context(), page, pageSize)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to list jobs")
		return
	}

	response.OK(c, http.StatusOK, gin.H{
		"jobs":  jobs,
		"total": total,
		"page":  page,
	})
}

func (h *JobHandler) Search(c *gin.Context) {
	q := c.Query("q")
	if q == "" {
		response.Error(c, http.StatusBadRequest, "VALIDATION_ERROR", "Search query is required")
		return
	}

	page, pageSize := parsePagination(c)

	jobs, total, err := h.jobUC.SearchJobs(c.Request.Context(), q, page, pageSize)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to search jobs")
		return
	}

	response.OK(c, http.StatusOK, gin.H{
		"jobs":  jobs,
		"total": total,
		"page":  page,
	})
}

func (h *JobHandler) ListMine(c *gin.Context) {
	userID := c.MustGet("user_id").(uuid.UUID)
	page, pageSize := parsePagination(c)

	jobs, total, err := h.jobUC.ListMyJobs(c.Request.Context(), userID, page, pageSize)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to list jobs")
		return
	}

	response.OK(c, http.StatusOK, gin.H{
		"jobs":  jobs,
		"total": total,
		"page":  page,
	})
}

func parsePagination(c *gin.Context) (int, int) {
	page := 1
	pageSize := 10

	if p, err := strconv.Atoi(c.Query("page")); err == nil && p > 0 {
		page = p
	}
	if ps, err := strconv.Atoi(c.Query("page_size")); err == nil && ps > 0 && ps <= 100 {
		pageSize = ps
	}

	return page, pageSize
}
