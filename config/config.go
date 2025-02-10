package config

import (
	"os"

	"github.com/joho/godotenv"
	"github.com/tramlinehq/store-sweeper/log"
)

type AuthConfig struct {
	Secret   string
	Issuer   string
	Audience string
}

type AppConfig struct {
	AppEnv          string
	AuthConfig      AuthConfig
	PlayStoreAPIUrl string
	AuthCertfile    string
	AuthPublicKey   string
}

var C *AppConfig

func Load() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
		panic(err)
	}

	C = &AppConfig{
		AppEnv: getEnv("ENV", "development"),
		AuthConfig: AuthConfig{
			Secret:   getEnv("AUTH_SECRET", ""),
			Issuer:   getEnv("AUTH_ISSUER", ""),
			Audience: getEnv("AUTH_AUDIENCE", ""),
		},
		PlayStoreAPIUrl: getEnv("PLAY_STORE_API_URL", "http://play-store-api:3000"),
		AuthCertfile:    getEnv("AUTH_CERT_FILE", ""),
		AuthPublicKey:   getEnv("AUTH_PUBLIC_KEY", ""),
	}
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}
