package web

import (
	"github.com/gin-gonic/gin"
	"github.com/tramlinehq/store-sweeper/config"
	"github.com/tramlinehq/store-sweeper/log"
	"github.com/tramlinehq/store-sweeper/web/handlers"
	mw "github.com/tramlinehq/store-sweeper/web/middleware"
)

const (
	appPort = ":8081"
)

func Run() {
	r := gin.Default()

	r.GET("/search", mw.SetEnv(), mw.ApiAuthMiddleware(), handlers.HandleSearch)
	// r.GET("/tsearch", handlers.HandleSearch)
	r.GET("/healthz", handlers.HandleHealthz)

	var err error

	if config.C.AppEnv != "production" {
		err = r.Run(appPort)
	} else {
		err = r.RunTLS(appPort, config.C.AuthCertfile, config.C.AuthPublicKey)
	}

	if err != nil {
		log.Fatalf("Error in starting the server")
		panic(err)
	}
}
