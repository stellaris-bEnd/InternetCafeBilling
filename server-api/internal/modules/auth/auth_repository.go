package auth

import (
	"cafe-api/internal/models"
	"gorm.io/gorm"
)

// AuthRepository mendefinisikan method untuk berinteraksi dengan data user
type AuthRepository interface {
	FindByEmail(email string) (*models.User, error)
	CreateUser(user *models.User) error
}

type authRepository struct {
	db *gorm.DB
}

// NewAuthRepository membuat instance repository baru
func NewAuthRepository(db *gorm.DB) AuthRepository {
	return &authRepository{db}
}

// FindByEmail mencari user berdasarkan email
// Ini adalah fungsi yang sebelumnya kosong
func (r *authRepository) FindByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// CreateUser menyimpan user baru ke database
func (r *authRepository) CreateUser(user *models.User) error {
	return r.db.Create(user).Error
}