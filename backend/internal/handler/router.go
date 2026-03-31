package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/thaisassuncao/hire-hub/backend/internal/middleware"
	"github.com/thaisassuncao/hire-hub/backend/pkg/jwt"
	"github.com/thaisassuncao/hire-hub/backend/pkg/response"
)

type Handlers struct {
	Auth        *AuthHandler
	Job         *JobHandler
	Application *ApplicationHandler
}

func NewRouter(corsOrigin string, jwtManager *jwt.Manager, h *Handlers) *gin.Engine {
	r := gin.Default()

	r.Use(middleware.CORS(corsOrigin))

	v1 := r.Group("/api/v1")
	{
		v1.GET("/health", func(c *gin.Context) {
			response.OK(c, http.StatusOK, gin.H{"status": "ok"})
		})

		auth := v1.Group("/auth")
		{
			auth.POST("/register", h.Auth.Register)
			auth.POST("/login", h.Auth.Login)
			auth.POST("/refresh", h.Auth.Refresh)
			auth.GET("/me", middleware.Auth(jwtManager), h.Auth.GetMe)
		}

		jobs := v1.Group("/jobs")
		{
			jobs.GET("", h.Job.List)
			jobs.GET("/search", h.Job.Search)
			jobs.GET("/:id", h.Job.GetByID)
			jobs.POST("", middleware.Auth(jwtManager), h.Job.Create)
			jobs.GET("/mine", middleware.Auth(jwtManager), h.Job.ListMine)
			jobs.POST("/:id/apply", middleware.Auth(jwtManager), h.Application.Apply)
		}

		applications := v1.Group("/applications")
		applications.Use(middleware.Auth(jwtManager))
		{
			applications.GET("/mine", h.Application.ListMine)
		}
	}

	return r
}
