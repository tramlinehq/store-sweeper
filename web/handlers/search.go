package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/tramlinehq/store-sweeper/web/lib"
)

func HandleSearch(ctx *gin.Context) {
	appStoreSearchOptions, err := lib.ConstructAppStoreSearchOptions(ctx)

	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	appStoreSearchResults, err := lib.SearchAppStore(appStoreSearchOptions)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"results": appStoreSearchResults})
}
