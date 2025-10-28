package billing

// DTO untuk response data komputer
type ComputerResponse struct {
	ID     uint   `json:"id"`
	Name   string `json:"name"`
	Status string `json:"status"`
	// Kita bisa tambahkan info user nanti jika statusnya 'occupied'
	Username *string `json:"username,omitempty"`
}