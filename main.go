package main

import (
	diako "github.com/cuppyzh/Go-Diako"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	diako.SetupRouter(router)
	router.Run()
}
