package database

import (
	"log"

	"cafe-api/internal/config"
	"cafe-api/internal/models" // Import model
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDatabase(cfg *config.Config) *gorm.DB {
	var err error
	DB, err = gorm.Open(postgres.Open(cfg.DB_DSN), &gorm.Config{})
	if err != nil {
		log.Fatal("Gagal terhubung ke database:", err)
	}

	log.Println("Koneksi database berhasil.")

	// AutoMigrate akan membuat tabel 'users' berdasarkan struct models.User
	err = DB.AutoMigrate(&models.User{})
	if err != nil {
		log.Fatal("Gagal melakukan migrasi database:", err)
	}

	err = DB.AutoMigrate(&models.User{}, &models.Computer{})
	if err != nil {
		log.Fatal("Gagal melakukan migrasi database:", err)
	}

	log.Println("Migrasi database berhasil.")
	return DB
}