package handler

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/go-playground/validator/v10"
)

// ContactRequest represents the structure of incoming contact form data
type ContactRequest struct {
	Name    string `json:"name" validate:"required,min=2,max=100"`
	Email   string `json:"email" validate:"required,email"`
	Subject string `json:"subject" validate:"required,min=5,max=200"`
	Message string `json:"message" validate:"required,min=10,max=2000"`
}

// ContactResponse represents the API response
type ContactResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

// ResendConfig holds Resend API configuration
type ResendConfig struct {
	APIKey    string
	FromEmail string
	ToEmail   string
}

// ResendEmailRequest represents the Resend API request structure
type ResendEmailRequest struct {
	From    string   `json:"from"`
	To      []string `json:"to"`
	Subject string   `json:"subject"`
	HTML    string   `json:"html"`
	ReplyTo string   `json:"reply_to"`
}

var (
	validate     = validator.New()
	resendConfig = ResendConfig{
		APIKey:    getEnv("RESEND_API_KEY", ""),
		FromEmail: getEnv("FROM_EMAIL", "onboarding@resend.dev"),
		ToEmail:   getEnv("TO_EMAIL", "ida.adiputra@outlook.com"),
	}
)

// getEnv gets environment variable with fallback
func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

// enableCORS adds CORS headers to the response
func enableCORS(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
}

// sanitizeInput removes potentially harmful characters
func sanitizeInput(input string) string {
	// Remove potential HTML/script tags
	input = strings.ReplaceAll(input, "<", "&lt;")
	input = strings.ReplaceAll(input, ">", "&gt;")
	input = strings.ReplaceAll(input, "\"", "&quot;")
	input = strings.ReplaceAll(input, "'", "&#x27;")
	return strings.TrimSpace(input)
}

// validateRequest validates the contact form request
func validateRequest(req *ContactRequest) error {
	// Sanitize inputs
	req.Name = sanitizeInput(req.Name)
	req.Email = sanitizeInput(req.Email)
	req.Subject = sanitizeInput(req.Subject)
	req.Message = sanitizeInput(req.Message)

	// Validate using struct tags
	return validate.Struct(req)
}

// sendEmail sends the contact form email using Resend API
func sendEmail(req *ContactRequest) error {
	// Create HTML body
	htmlBody := fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="UTF-8">
			<style>
				body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
				.container { max-width: 600px; margin: 0 auto; padding: 20px; }
				.header { background-color: #3366FF; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
				.content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
				.field { margin-bottom: 15px; }
				.label { font-weight: bold; color: #555; }
				.value { margin-top: 5px; padding: 10px; background-color: white; border-radius: 3px; border-left: 3px solid #3366FF; }
				.footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
			</style>
		</head>
		<body>
			<div class="container">
				<div class="header">
					<h2>New Contact Form Submission</h2>
					<p>You have received a new message from your portfolio website.</p>
				</div>
				<div class="content">
					<div class="field">
						<div class="label">Name:</div>
						<div class="value">%s</div>
					</div>
					<div class="field">
						<div class="label">Email:</div>
						<div class="value">%s</div>
					</div>
					<div class="field">
						<div class="label">Subject:</div>
						<div class="value">%s</div>
					</div>
					<div class="field">
						<div class="label">Message:</div>
						<div class="value">%s</div>
					</div>
					<div class="field">
						<div class="label">Submitted at:</div>
						<div class="value">%s</div>
					</div>
				</div>
				<div class="footer">
					<p>This message was sent from your portfolio contact form.</p>
				</div>
			</div>
		</body>
		</html>
	`, req.Name, req.Email, req.Subject,
		strings.ReplaceAll(req.Message, "\n", "<br>"),
		time.Now().Format("January 2, 2006 at 3:04 PM MST"))

	// Prepare Resend API request
	emailReq := ResendEmailRequest{
		From:    fmt.Sprintf("Portfolio Contact <%s>", resendConfig.FromEmail),
		To:      []string{resendConfig.ToEmail},
		Subject: fmt.Sprintf("Portfolio Contact: %s", req.Subject),
		HTML:    htmlBody,
		ReplyTo: req.Email,
	}

	// Convert to JSON
	jsonData, err := json.Marshal(emailReq)
	if err != nil {
		return fmt.Errorf("failed to marshal email request: %v", err)
	}

	// Create HTTP request to Resend API
	httpReq, err := http.NewRequest("POST", "https://api.resend.com/emails", bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to create HTTP request: %v", err)
	}

	// Set headers
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", fmt.Sprintf("Bearer %s", resendConfig.APIKey))

	// Send request
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(httpReq)
	if err != nil {
		return fmt.Errorf("failed to send email via Resend: %v", err)
	}
	defer resp.Body.Close()

	// Check response status
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("Resend API returned status %d", resp.StatusCode)
	}

	return nil
}

// contactHandler handles the contact form submission
func contactHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Set content type
	w.Header().Set("Content-Type", "application/json")

	// Parse request body
	var req ContactRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Error decoding request: %v", err)
		response := ContactResponse{
			Success: false,
			Message: "Invalid request format",
		}
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(response)
		return
	}

	// Validate request
	if err := validateRequest(&req); err != nil {
		log.Printf("Validation error: %v", err)
		response := ContactResponse{
			Success: false,
			Message: "Please check your input and try again",
		}
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(response)
		return
	}

	// Send email
	if err := sendEmail(&req); err != nil {
		log.Printf("Error sending email: %v", err)
		response := ContactResponse{
			Success: false,
			Message: "Failed to send message. Please try again later.",
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}

	// Log successful submission (without sensitive data)
	log.Printf("Contact form submitted successfully by %s (%s)", req.Name, req.Email)

	// Return success response
	response := ContactResponse{
		Success: true,
		Message: "Message sent successfully! I'll get back to you soon.",
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// healthHandler provides a health check endpoint
func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"status":    "healthy",
		"service":   "portfolio-contact-api",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}

// Handler is the main entry point for Vercel
func Handler(w http.ResponseWriter, r *http.Request) {
	// Enable CORS
	enableCORS(w, r)

	if r.Method == "OPTIONS" {
		return
	}

	// Route to appropriate handler
	switch r.URL.Path {
	case "/api/contact":
		contactHandler(w, r)
	case "/api/health":
		healthHandler(w, r)
	default:
		http.NotFound(w, r)
	}
}
