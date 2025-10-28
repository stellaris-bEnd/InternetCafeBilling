package admin

import "github.com/gofiber/fiber/v2"

// --- DUMMY HANDLER ---

type ChangeRoleRequest struct {
	UserID uint   `json:"userId"`
	NewRole string `json:"newRole"` // "vip" | "vvip"
}

type PriceChangeRequest struct {
	ItemName string `json:"itemName"`
	NewPrice int    `json:"newPrice"`
}

type ForceLogoutRequest struct {
	ComputerID uint `json:"computerId"`
}

type AdminHandler struct{}

func NewAdminHandler() *AdminHandler {
	return &AdminHandler{}
}

// Fitur 3: Admin dapat merubah status role member
func (h *AdminHandler) ChangeMemberRole(c *fiber.Ctx) error {
	var req ChangeRoleRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}

	// (LOGIKA DUMMY: Di dunia nyata, kita akan update DB)
	// (Kita juga perlu middleware untuk cek apakah user adalah admin)
	
	return c.JSON(fiber.Map{
		"success": true,
		"message": "Berhasil mengubah role user " + string(req.UserID) + " menjadi " + req.NewRole,
	})
}

// Fitur 4: Admin dapat mengatur harga
func (h *AdminHandler) UpdatePrice(c *fiber.Ctx) error {
	var req PriceChangeRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}
	
	return c.JSON(fiber.Map{
		"success": true,
		"message": "Berhasil mengubah harga " + req.ItemName,
	})
}

func (h *AdminHandler) ForceLogoutPC(c *fiber.Ctx) error {
	var req ForceLogoutRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}
	
	// (LOGIKA DUMMY: Di dunia nyata, kita akan update status PC
	// dan mengirim WebSocket update)

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Berhasil force logout PC " + string(req.ComputerID),
	})
}