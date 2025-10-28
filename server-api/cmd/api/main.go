package main

import (
	"log"

	"cafe-api/internal/config"
	"cafe-api/internal/database"
	// IMPORT BARU (pastikan ini ada)
	"cafe-api/internal/modules/admin"
	"cafe-api/internal/modules/auth"
	"cafe-api/internal/modules/billing"
	"cafe-api/internal/modules/booking"
	"cafe-api/internal/modules/menu"
	
	"cafe-api/internal/router"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	cfg := config.LoadConfig()

	// Inisialisasi DB dengan PrepareStmt: false
	db := database.InitDatabase(cfg)

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	// 5. Inisialisasi Dependency Injection (DI)
	authRepo := auth.NewAuthRepository(db)
	authService := auth.NewAuthService(authRepo)
	authHandler := auth.NewAuthHandler(authService)

	billingHandler := billing.NewBillingHandler()
	
	// --- INISIALISASI HANDLER BARU ---
	menuHandler := menu.NewMenuHandler()
	bookingHandler := booking.NewBookingHandler()
	adminHandler := admin.NewAdminHandler()
	// ---

	// 6. Setup Rute
	// Pastikan semua handler baru dimasukkan di sini
	router.SetupRoutes(
		app,
		authHandler,
		billingHandler,
		menuHandler,
		bookingHandler,
		adminHandler,
	)

	// 7. Jalankan Server
	log.Println("Server backend berjalan di port :8080...")
	log.Fatal(app.Listen(":8080"))
}