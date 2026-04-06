package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/smtp"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtKey = []byte("flickk_enterprise_secret_key_2026")

type Credentials struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type Claims struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func handleRegister(w http.ResponseWriter, r *http.Request) {
	var creds Credentials
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	user, err := registerUser(creds.Email, creds.Username, creds.Password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}

func handleLogin(w http.ResponseWriter, r *http.Request) {
	var creds Credentials
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	user, err := authenticateUser(creds.Email, creds.Password)
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Email:    user.Email,
		Username: user.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:    "token",
		Value:   tokenString,
		Expires: expirationTime,
		Path:    "/",
	})

	log.Printf("User logged in: %s (%s)", user.Username, user.Email)
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"token":          tokenString,
		"username":       user.Username,
		"wallet_address": user.WalletAddress,
	})
}

// ─── SMTP Password Reset ───

type ResetRequest struct {
	Email string `json:"email"`
}

type ResetPasswordPayload struct {
	Token       string `json:"token"`
	NewPassword string `json:"new_password"`
}

func handleRequestReset(w http.ResponseWriter, r *http.Request) {
	var req ResetRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	token, err := generatePasswordResetToken(req.Email)
	if err != nil {
		// Do not leak if user exists or not
		w.WriteHeader(http.StatusOK)
		return
	}

	sendResetEmail(req.Email, token)
	w.WriteHeader(http.StatusOK)
}

func handleResetPassword(w http.ResponseWriter, r *http.Request) {
	var payload ResetPasswordPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	err := validateAndResetPassword(payload.Token, payload.NewPassword)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Password reset successfully")
}

func sendResetEmail(toAddr, token string) {
	host := os.Getenv("SMTP_HOST")
	port := os.Getenv("SMTP_PORT")
	user := os.Getenv("SMTP_USER")
	pass := os.Getenv("SMTP_PASS")

	// Determine frontend domain fallback
	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:8080"
	}

	resetLink := fmt.Sprintf("%s/reset-password.html?token=%s", frontendURL, token)

	// Development mode fallback
	if host == "" || pass == "" {
		fmt.Println("\n=======================================================")
		fmt.Println("📧 [DEV MODE] PASSWORD RESET EMAIL INTERCEPTED")
		fmt.Printf("To: %s\n", toAddr)
		fmt.Printf("Link: %s\n", resetLink)
		fmt.Println("=======================================================")
		return
	}

	// Real SMTP send
	auth := smtp.PlainAuth("", user, pass, host)
	msg := []byte("To: " + toAddr + "\r\n" +
		"Subject: Onigiri.Z Password Reset\r\n" +
		"\r\n" +
		"Click the link below to reset your password:\n" + resetLink + "\r\n")

	addr := fmt.Sprintf("%s:%s", host, port)
	err := smtp.SendMail(addr, auth, user, []string{toAddr}, msg)
	if err != nil {
		log.Printf("Failed to send SMTP email: %v", err)
	} else {
		log.Printf("Sent reset email to %s", toAddr)
	}
}
