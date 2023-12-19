package main

import (
	"easy-bars/config"
	"easy-bars/route"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	config.ConnectDB()
	route.TestRoute(r)
	r.Run()
}
