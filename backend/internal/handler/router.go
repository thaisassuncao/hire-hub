package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/thaisassuncao/hire-hub/backend/internal/middleware"
	"github.com/thaisassuncao/hire-hub/backend/pkg/response"
)

func NewRouter(corsOrigin string) *gin.Engine {
	r := gin.Default()

	r.Use(middleware.CORS(corsOrigin))

	v1 := r.Group("/api/v1")
	{
		v1.GET("/health", func(c *gin.Context) {
			response.OK(c, http.StatusOK, gin.H{"status": "ok"})
		})
	}

	return r
}
