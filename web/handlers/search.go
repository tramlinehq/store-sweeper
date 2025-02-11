package handlers

import (
	err "errors"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/tramlinehq/store-sweeper/log"
	"github.com/tramlinehq/store-sweeper/web/lib"
	"go.uber.org/zap"
	"golang.org/x/sync/errgroup"
)

type storeResult struct {
	Results []lib.SearchResult
	Error   error
}

func HandleSearch(ctx *gin.Context) {
	var g errgroup.Group
	appStore := storeResult{}
	playStore := storeResult{}

	g.Go(func() error {
		opts, err := lib.ConstructAppStoreSearchOptions(ctx)
		if err != nil {
			appStore.Error = err
			return nil
		}
		results, err := lib.SearchAppStore(opts)
		appStore.Results = results
		appStore.Error = err
		return nil
	})

	g.Go(func() error {
		opts, err := lib.ConstructPlayStoreSearchOptions(ctx)
		if err != nil {
			playStore.Error = err
			return nil
		}
		results, err := lib.SearchPlayStore(opts)
		playStore.Results = results
		playStore.Error = err
		return nil
	})

	// Wait for all searches to complete
	g.Wait()

	response := gin.H{
		"results": gin.H{
			"app_store":  appStore.Results,
			"play_store": playStore.Results,
		},
	}

	var errors []string
	if appStore.Error != nil {
		errors = append(errors, fmt.Sprintf("app_store: %v", appStore.Error))
	}
	if playStore.Error != nil {
		errors = append(errors, fmt.Sprintf("play_store: %v", playStore.Error))
	}

	if len(errors) > 0 {
		response["errors"] = errors
		if len(errors) == 2 {
			for _, e := range errors {
				log.ErrorLogger(err.New(e), "scraping request failed", zap.String("error", e))
			}
			ctx.JSON(500, response)
			return
		}
		log.ErrorLogger(err.New(errors[0]), "scraping request partially failed", zap.String("error", errors[0]))
		ctx.JSON(206, response)
		return
	}

	ctx.JSON(200, response)
}
