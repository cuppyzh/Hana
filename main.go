package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"log"
)

func main() {
	router := setupRouter();
	router.Run(":9008")
}

func testData(c *gin.Context) {
	var testData = "test";
    c.IndentedJSON(http.StatusOK, testData)
}

func setupRouter() *gin.Engine {
	router := gin.Default()

	// Ping test API
	router.GET("/api/test/ping", func(context *gin.Context){
		context.String(http.StatusOK, "pong")
	})

	// Diako 
	router.POST("/api/diako/message", func(context *gin.Context){
		var request MessageRequest

		if err := context.ShouldBindJSON(&request); err != nil {
			context.JSON(http.StatusBadRequest, errorResponse(err))
			return
		}

		log.Println("Test: " + request.Sender)
		context.String(http.StatusOK, "")
	})

	return router
}

func errorResponse(err error) gin.H {
    return gin.H{"error": err.Error()}
}