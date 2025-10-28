package billing

import (
	"cafe-api/internal/models"
	
	// 1. TAMBAHKAN IMPORT GORM YANG HILANG
	"gorm.io/gorm" 
)

// VERSI DUMMY
func GetDummyComputers() []models.Computer {
	return []models.Computer{
		// 2. 'gorm.Model' SEKARANG DIKENALI
		{Model: gorm.Model{ID: 1}, Name: "PC 01", Status: models.StatusAvailable},
		{Model: gorm.Model{ID: 2}, Name: "PC 02", Status: models.StatusOccupied, CurrentUserID: new(uint)},
		{Model: gorm.Model{ID: 3}, Name: "PC 03", Status: models.StatusAvailable},
		{Model: gorm.Model{ID: 4}, Name: "PC 04", Status: models.StatusMaintenance},
		{Model: gorm.Model{ID: 5}, Name: "PC 05", Status: models.StatusAvailable},
		{Model: gorm.Model{ID: 6}, Name: "VIP 01", Status: models.StatusAvailable},
	}
}