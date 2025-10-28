package billing

import "github.com/gofiber/fiber/v2"

// Kita tidak perlu service/repo struct untuk dummy
type BillingHandler struct{}

func NewBillingHandler() *BillingHandler {
	return &BillingHandler{}
}

func (h *BillingHandler) GetComputers(c *fiber.Ctx) error {
	// Panggil data dummy
	dummyComputers := GetDummyComputers()

	// Format response
	response := make([]ComputerResponse, len(dummyComputers))
	for i, comp := range dummyComputers {
		response[i] = ComputerResponse{
			ID:     comp.ID,
			Name:   comp.Name,
			Status: string(comp.Status),
		}
		// Logika dummy untuk username
		if comp.Status == "occupied" {
			dummyName := "noobel" 
			response[i].Username = &dummyName
		}
	}

	return c.JSON(response)
}