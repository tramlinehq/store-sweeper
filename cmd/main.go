package main

import (
	"github.com/tramlinehq/store-sweeper/config"
	"github.com/tramlinehq/store-sweeper/log"
	"github.com/tramlinehq/store-sweeper/web"
)

func main() {
	config.Load()
	log.Init()
	web.Run()
}
