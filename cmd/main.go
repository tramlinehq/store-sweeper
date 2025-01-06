package main

import (
	"github.com/tramlinehq/store-sweeper/config"
	"github.com/tramlinehq/store-sweeper/log"
)

func main() {
	config.Load()
	log.Init()
}
