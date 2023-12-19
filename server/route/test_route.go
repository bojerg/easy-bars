package route

import (
	"easy-bars/controller"
	"net/http"

	"github.com/gin-gonic/gin"
)

func TestRoute(r *gin.Engine) {
	r.GET("/test", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "hello world",
		})
	})
	r.POST("/ping", controller.CreatePing())
	r.GET("/pong/:pingId", controller.GetAPing())
}
