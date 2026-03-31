package response

import "github.com/gin-gonic/gin"

type Response struct {
	Success   bool        `json:"success"`
	Data      interface{} `json:"data,omitempty"`
	Message   string      `json:"message,omitempty"`
	Errors    interface{} `json:"errors,omitempty"`
	ErrorCode string      `json:"error_code,omitempty"`
}

func OK(c *gin.Context, status int, data interface{}) {
	c.JSON(status, Response{
		Success: true,
		Data:    data,
	})
}

func OKWithMessage(c *gin.Context, status int, data interface{}, message string) {
	c.JSON(status, Response{
		Success: true,
		Data:    data,
		Message: message,
	})
}

func Error(c *gin.Context, status int, errorCode string, message string) {
	c.JSON(status, Response{
		Success:   false,
		Message:   message,
		ErrorCode: errorCode,
	})
}

func ErrorWithDetails(c *gin.Context, status int, errorCode string, message string, errors interface{}) {
	c.JSON(status, Response{
		Success:   false,
		Message:   message,
		ErrorCode: errorCode,
		Errors:    errors,
	})
}
