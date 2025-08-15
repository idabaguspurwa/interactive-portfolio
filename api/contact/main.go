package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/go-playground/validator/v10"
	"gopkg.in/gomail.v2"
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

// EmailConfig holds email configuration
type EmailConfig struct {
	SMTPHost     string
	SMTPPort     int
	SMTPUsername string
	SMTPPassword string
	FromEmail    string
	ToEmail      string
}

var (
	validate    = validator.New()
	emailConfig = EmailConfig{
		SMTPHost:     getEnv("SMTP_HOST", "smtp.gmail.com"),
		SMTPPort:     587,
		SMTPUsername: getEnv("SMTP_USERNAME", ""),
		SMTPPassword: getEnv("SMTP_PASSWORD", ""),
		FromEmail:    getEnv("FROM_EMAIL", "noreply@idabagusgedepm.dev"),
		ToEmail:      getEnv("TO_EMAIL", "ida.adiputra@outlook.com"),
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

// sendEmail sends the contact form email
func sendEmail(req *ContactRequest) error {
	// Create email message
	m := gomail.NewMessage()
	m.SetHeader("From", emailConfig.FromEmail)
	m.SetHeader("To", emailConfig.ToEmail)
	m.SetHeader("Subject", fmt.Sprintf("Portfolio Contact: %s", req.Subject))

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

	m.SetBody("text/html", htmlBody)

	// Set reply-to header
	m.SetHeader("Reply-To", req.Email)

	// Create dialer and send
	d := gomail.NewDialer(emailConfig.SMTPHost, emailConfig.SMTPPort, emailConfig.SMTPUsername, emailConfig.SMTPPassword)

	return d.DialAndSend(m)
}

// contactHandler handles the contact form submission
func contactHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w, r)

	if r.Method == "OPTIONS" {
		return
	}

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

func main() {
	// Setup routes
	http.HandleFunc("/api/contact", contactHandler)
	http.HandleFunc("/api/health", healthHandler)

	// Get port from environment
	port := getEnv("PORT", "8080")

	log.Printf("Server starting on port %s", port)
	log.Printf("SMTP configured for host: %s", emailConfig.SMTPHost)

	// Start server
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
