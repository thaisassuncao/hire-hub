package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/thaisassuncao/hire-hub/backend/internal/middleware"
	"github.com/thaisassuncao/hire-hub/backend/pkg/jwt"
	"github.com/thaisassuncao/hire-hub/backend/pkg/response"
)

type Handlers struct {
	Auth *AuthHandler
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
	}

	return r
}
