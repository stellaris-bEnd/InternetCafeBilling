package auth

import "cafe-api/internal/models"

// DTO untuk request body /auth/login
type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
}

// DTO untuk request body /auth/register
type RegisterRequest struct {
	Username string `json:"username" validate:"required,min=3"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
}

// DTO untuk response /auth/login dan /auth/register
// (Hanya ada SATU definisi)
type LoginResponse struct {
	Token string       `json:"token"`
	User  UserResponse `json:"user"`
}

// Struct untuk data user yang dikirim ke frontend
// (Versi LENGKAP dengan update)
type UserResponse struct {
	ID                   uint   `json:"id"`
	Email                string `json:"email"`
	Username             string `json:"username"`
	Role                 string `json:"role"`
	MemberStatus         string `json:"memberStatus"`
	RemainingTimeSeconds int    `json:"remainingTimeSeconds"`
}

// Helper untuk memformat user
// (Versi LENGKAP dengan update)
func FormatUser(user models.User) UserResponse {
	return UserResponse{
		ID:                   user.ID,
		Email:                user.Email,
		Username:             user.Username,
		Role:                 string(user.Role),
		MemberStatus:         string(user.MemberStatus),
		RemainingTimeSeconds: user.RemainingTimeSeconds,
	}
}