package handlers

import "github.com/gin-gonic/gin"

func HandleHealthz(ctx *gin.Context) {
	ctx.JSON(200, gin.H{"message": "OK"})
}
