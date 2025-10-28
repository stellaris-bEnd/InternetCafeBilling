package menu

import "github.com/gofiber/fiber/v2"

// --- DUMMY HANDLER ---

type PriceListResponse struct {
	Packages []PackagePrice `json:"packages"`
	Products []ProductPrice `json:"products"`
	Upgrades []UpgradePrice `json:"upgrades"`
}

type PackagePrice struct {
	Name  string `json:"name"`
	Price int    `json:"price"`
}
type ProductPrice struct {
	Name  string `json:"name"`
	Price int    `json:"price"`
	Type  string `json:"type"` // "food" | "drink"
}
type UpgradePrice struct {
	Name  string `json:"name"`
	Price int    `json:"price"`
}

type MenuHandler struct{}

func NewMenuHandler() *MenuHandler {
	return &MenuHandler{}
}

func (h *MenuHandler) GetPrices(c *fiber.Ctx) error {
	dummyResponse := PriceListResponse{
		Packages: []PackagePrice{
			{Name: "Paket 1 Jam", Price: 5000},
			{Name: "Paket 3 Jam", Price: 13000},
			{Name: "Paket 5 Jam", Price: 20000},
		},
		Products: []ProductPrice{
			{Name: "Indomie Rebus", Price: 8000, Type: "food"},
			{Name: "Nasi Goreng", Price: 15000, Type: "food"},
			{Name: "Es Teh Manis", Price: 4000, Type: "drink"},
			{Name: "Kopi Hitam", Price: 5000, Type: "drink"},
		},
		Upgrades: []UpgradePrice{
			{Name: "Upgrade ke VIP (30 hari)", Price: 50000},
			{Name: "Upgrade ke VVIP (30 hari)", Price: 100000},
		},
	}
	return c.JSON(dummyResponse)
}