package auth

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

// AuthHandler memegang dependensi service
type AuthHandler struct {
	service AuthService
}

// NewAuthHandler membuat instance handler baru
func NewAuthHandler(service AuthService) *AuthHandler {
	return &AuthHandler{service}
}

// Login menghandle request login
// Ini adalah fungsi yang sebelumnya kosong
func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req LoginRequest

	// 1. Parse request body
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}

	// 2. Validasi input
	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	// 3. Panggil service
	user, token, err := h.service.Login(req)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}

	// 4. Sukses, kirim response
	return c.JSON(LoginResponse{
		Token: token,
		User:  FormatUser(*user),
	})
}

// Register menghandle request registrasi
func (h *AuthHandler) Register(c *fiber.Ctx) error {
	var req RegisterRequest

	// 1. Parse body
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}

	// 2. Validasi input
	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	// 3. Panggil service
	user, token, err := h.service.Register(req)
	if err != nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": err.Error()})
	}

	// 4. Sukses, kirim response
	return c.Status(fiber.StatusCreated).JSON(LoginResponse{
		Token: token,
		User:  FormatUser(*user),
	})
}