package handlers

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/tramlinehq/store-sweeper/web/lib"
)

func HandleSearch(ctx *gin.Context) {
	searchTerm := ctx.Query("searchTerm")
	if searchTerm == "" {
		ctx.JSON(400, gin.H{"error": "searchTerm query parameter is required"})
		return
	}
	country := ctx.DefaultQuery("country", "us")
	numCount, err := strconv.Atoi(ctx.DefaultQuery("resultCount", "10"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "resultCount query parameter must be an integer"})
		return
	}
	lang := ctx.DefaultQuery("lang", "en-us")

	searchOptions := lib.SearchOptions{
		SearchTerm: searchTerm,
		NumCount:   numCount,
		Country:    lib.GetCountryCode(country),
		Language:   lang,
	}

	searchResults, err := lib.SearchAppStore(searchOptions)

	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"results": searchResults})
}
