package router

import (
	// IMPORT BARU (pastikan ini ada)
	"cafe-api/internal/modules/admin"
	"cafe-api/internal/modules/auth"
	"cafe-api/internal/modules/billing"
	"cafe-api/internal/modules/booking"
	"cafe-api/internal/modules/menu"
	
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

// Pastikan fungsi SetupRoutes menerima SEMUA handler
func SetupRoutes(
	app *fiber.App,
	authHandler *auth.AuthHandler,
	billingHandler *billing.BillingHandler,
	menuHandler *menu.MenuHandler,       // <-- Handler baru
	bookingHandler *booking.BookingHandler, // <-- Handler baru
	adminHandler *admin.AdminHandler,       // <-- Handler baru
) {
	app.Use(logger.New())

	api := app.Group("/api/v1")

	// Grup Auth
	authGroup := api.Group("/auth")
	authGroup.Post("/login", authHandler.Login)
	authGroup.Post("/register", authHandler.Register)

	// Grup Member
	// (Nanti kita bisa tambahkan middleware auth di sini)
	api.Get("/billing/computers", billingHandler.GetComputers)
	
	// --- RUTE BARU YANG MENYEBABKAN 404 ---
	api.Get("/menu/prices", menuHandler.GetPrices)
	api.Post("/booking/create", bookingHandler.CreateBooking)
	// ---

	// Grup Admin (Dummy)
	adminGroup := api.Group("/admin")
	adminGroup.Post("/change-role", adminHandler.ChangeMemberRole)
	adminGroup.Post("/update-price", adminHandler.UpdatePrice)
	adminGroup.Post("/force-logout", adminHandler.ForceLogoutPC)
}