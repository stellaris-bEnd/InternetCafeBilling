package models

import "gorm.io/gorm"

// Kita akan gunakan 'member', 'admin'
type UserRole string
type MemberStatus string

const (
	RoleMember UserRole = "member"
	RoleAdmin  UserRole = "admin"
)

type User struct {
	gorm.Model           // Menambahkan ID, CreatedAt, UpdatedAt, DeletedAt
	Email        string `gorm:"uniqueIndex;not null"`
	PasswordHash string `gorm:"not null"`
	Username     string
	Role         UserRole `gorm:"type:varchar(10);default:'member'"`
	// Tambahkan field lain dari skema Anda nanti
	// Balance                 float64
	// RemainingTimeSeconds    int
	MemberStatus        MemberStatus `gorm:"type:varchar(10);default:'regular'"`
	RemainingTimeSeconds int        `gorm:"default:0"`
}