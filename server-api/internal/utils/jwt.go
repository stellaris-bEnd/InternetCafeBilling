package utils

import (
	"cafe-api/internal/config"
	"time"

	"github.com/gofiber/fiber/v2"

	// 1. IMPORT MIDDLEWARE SEBAGAI 'jwtware'
	jwtware "github.com/gofiber/contrib/jwt"

	// 2. IMPORT LIBRARY UNTUK MEMBUAT TOKEN
	"github.com/golang-jwt/jwt/v5"
)

// Middleware untuk melindungi route
func JWTMiddleware() fiber.Handler {
	// 3. GUNAKAN 'jwtware' DI SINI
	return jwtware.New(jwtware.Config{
		// 
		//  INI BARIS YANG DIPERBAIKI:
		//  Bukan 'jwtware.Key' tapi 'jwtware.SigningKey'
		//
		SigningKey: jwtware.SigningKey{Key: []byte(config.AppConfig.JWTSecret)},
	})
}

// GenerateToken membuat token baru untuk user
func GenerateToken(userID uint, email string, role string) (string, error) {
	// 4. GUNAKAN 'jwt' (dari golang-jwt) DI SINI
	claims := jwt.MapClaims{
		"user_id": userID,
		"email":   email,
		"role":    role,
		"exp":     time.Now().Add(time.Hour * 72).Unix(), // Token berlaku 3 hari
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	t, err := token.SignedString([]byte(config.AppConfig.JWTSecret))
	if err != nil {
		return "", err
	}
	return t, nil
}