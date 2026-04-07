package main

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"sync"
	"time"

	"golang.org/x/crypto/bcrypt"
)

const usersFile = "users.json"

type UserStore struct {
	Users map[string]User `json:"users"`
	mu    sync.Mutex
}

var userStore *UserStore

func initUserStore() {
	userStore = &UserStore{
		Users: make(map[string]User),
	}
	loadUsers()
}

func loadUsers() {
	data, err := os.ReadFile(usersFile)
	if err != nil {
		return
	}
	err = json.Unmarshal(data, &userStore.Users)
	if err != nil {
		log.Printf("Error unmarshaling users: %v", err)
	}
}

func saveUsers() {
	data, err := json.MarshalIndent(userStore.Users, "", "  ")
	if err != nil {
		log.Printf("Error marshaling users: %v", err)
		return
	}
	err = os.WriteFile(usersFile, data, 0644)
	if err != nil {
		log.Printf("Warning: Could not save users file: %v (continuing anyway)", err)
		// Don't fail - Render has ephemeral storage, users are kept in memory
	}
}

func registerUser(email, username, password string) (User, error) {
	userStore.mu.Lock()
	defer userStore.mu.Unlock()

	if _, exists := userStore.Users[email]; exists {
		return User{}, fmt.Errorf("user already exists with that email")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return User{}, err
	}

	walletAddr := generateWalletAddress()

	user := User{
		Email:         email,
		Username:      username,
		PasswordHash:  string(hashedPassword),
		WalletAddress: walletAddr,
	}

	userStore.Users[email] = user
	saveUsers()

	return user, nil
}

func authenticateUser(email, password string) (User, error) {
	userStore.mu.Lock()
	defer userStore.mu.Unlock()

	user, exists := userStore.Users[email]
	if !exists {
		return User{}, fmt.Errorf("invalid credentials")
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	if err != nil {
		return User{}, fmt.Errorf("invalid credentials")
	}

	return user, nil
}

func generateWalletAddress() string {
	bytes := make([]byte, 16)
	_, err := rand.Read(bytes)
	if err != nil {
		log.Printf("Error generating wallet address: %v", err)
		return "ogz_error"
	}
	return "ogz_" + hex.EncodeToString(bytes)
}

func generatePasswordResetToken(email string) (string, error) {
	userStore.mu.Lock()
	defer userStore.mu.Unlock()

	user, exists := userStore.Users[email]
	if !exists {
		return "", fmt.Errorf("user not found")
	}

	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	token := hex.EncodeToString(bytes)

	user.ResetToken = token
	user.ResetExpires = time.Now().Add(1 * time.Hour).Unix()
	userStore.Users[email] = user
	saveUsers()

	return token, nil
}

func validateAndResetPassword(token, newPassword string) error {
	userStore.mu.Lock()
	defer userStore.mu.Unlock()

	var targetEmail string
	for email, user := range userStore.Users {
		if user.ResetToken == token {
			if time.Now().Unix() > user.ResetExpires {
				return fmt.Errorf("reset token expired")
			}
			targetEmail = email
			break
		}
	}

	if targetEmail == "" {
		return fmt.Errorf("invalid reset token")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user := userStore.Users[targetEmail]
	user.PasswordHash = string(hashedPassword)
	user.ResetToken = ""
	user.ResetExpires = 0
	userStore.Users[targetEmail] = user
	saveUsers()

	return nil
}
