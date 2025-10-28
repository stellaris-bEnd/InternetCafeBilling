package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DB_DSN    string
	JWTSecret string
}

var AppConfig *Config

func LoadConfig() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Println("Peringatan: Tidak dapat memuat file .env")
	}

	AppConfig = &Config{
		DB_DSN:    os.Getenv("DB_DSN"),
		JWTSecret: os.Getenv("JWT_SECRET"),
	}

	if AppConfig.DB_DSN == "" {
		log.Fatal("DB_DSN harus diatur di environment variable")
	}
	if AppConfig.JWTSecret == "" {
		log.Fatal("JWT_SECRET harus diatur di environment variable")
	}

	return AppConfig
}