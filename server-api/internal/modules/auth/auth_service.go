package auth

import (
	"cafe-api/internal/models"
	"cafe-api/internal/utils"
	"errors"
	"strings"

	"gorm.io/gorm"
)

// AuthService mendefinisikan logika bisnis untuk otentikasi
type AuthService interface {
	Login(req LoginRequest) (*models.User, string, error)
	Register(req RegisterRequest) (*models.User, string, error)
}

type authService struct {
	repo AuthRepository
}

// NewAuthService membuat instance service baru
func NewAuthService(repo AuthRepository) AuthService {
	return &authService{repo}
}

// Login memvalidasi kredensial user
// Ini adalah fungsi yang sebelumnya kosong
func (s *authService) Login(req LoginRequest) (*models.User, string, error) {
	// 1. Cari user berdasarkan email
	user, err := s.repo.FindByEmail(req.Email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, "", errors.New("email atau password salah")
		}
		return nil, "", err
	}

	// 2. Validasi password
	isValid := utils.CheckPasswordHash(req.Password, user.PasswordHash)
	if !isValid {
		return nil, "", errors.New("email atau password salah")
	}

	// 3. Generate JWT Token
	token, err := utils.GenerateToken(user.ID, user.Email, string(user.Role))
	if err != nil {
		return nil, "", errors.New("gagal membuat token")
	}

	return user, token, nil
}

// Register membuat user baru
func (s *authService) Register(req RegisterRequest) (*models.User, string, error) {
	// 1. Cek apakah email sudah ada
	existingUser, err := s.repo.FindByEmail(req.Email)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, "", err
	}
	if existingUser != nil {
		return nil, "", errors.New("email sudah terdaftar")
	}

	// 2. Hash password
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, "", errors.New("gagal memproses password")
	}

	// 3. Buat struct user baru
	newUser := &models.User{
		Username:     req.Username,
		Email:        strings.ToLower(req.Email),
		PasswordHash: hashedPassword,
		Role:         models.RoleMember, // Default role
	}

	// 4. Simpan ke database
	err = s.repo.CreateUser(newUser)
	if err != nil {
		return nil, "", errors.New("gagal mendaftarkan user")
	}

	// 5. Generate token (langsung loginkan)
	token, err := utils.GenerateToken(newUser.ID, newUser.Email, string(newUser.Role))
	if err != nil {
		return nil, "", errors.New("gagal membuat token")
	}

	return newUser, token, nil
}