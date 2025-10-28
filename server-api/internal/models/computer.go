package models

import "gorm.io/gorm"

type ComputerStatus string

const (
	StatusAvailable   ComputerStatus = "available"
	StatusOccupied    ComputerStatus = "occupied"
	StatusMaintenance ComputerStatus = "maintenance"
)

type Computer struct {
	gorm.Model
	Name     string         `gorm:"not null"`
	Status   ComputerStatus `gorm:"type:varchar(15);default:'available'"`
	CurrentUserID *uint          // Nullable, foreign key ke users.id
	CurrentUser   User           `gorm:"foreignKey:CurrentUserID"` // Relasi
}