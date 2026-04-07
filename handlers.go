package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
)

type contextKey string

const userContextKey contextKey = "user"

// AuthMiddleware validates the JWT token
func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString := ""
		
		// 1. Check Cookie
		c, err := r.Cookie("token")
		if err == nil {
			tokenString = c.Value
		}
		
		// 2. Check Authorization header
		if tokenString == "" {
			authHeader := r.Header.Get("Authorization")
			if strings.HasPrefix(authHeader, "Bearer ") {
				tokenString = strings.TrimPrefix(authHeader, "Bearer ")
			}
		}

		if tokenString == "" {
			http.Error(w, "Unauthorized access", http.StatusUnauthorized)
			return
		}

		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
			return
		}

		// Add email to context
		ctx := context.WithValue(r.Context(), userContextKey, claims.Email)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// handleGetBlockchain returns the entire chain as JSON
func handleGetBlockchain(w http.ResponseWriter, r *http.Request) {
	blockchain.mu.Lock()
	defer blockchain.mu.Unlock()
	
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(blockchain.Blocks); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// handleGetBalance calculates balance for a wallet address by scanning the entire chain
func handleGetBalance(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	address := vars["address"]

	blockchain.mu.Lock()
	defer blockchain.mu.Unlock()

	var balance float64
	var sent float64
	var received float64

	for _, block := range blockchain.Blocks {
		for _, tx := range block.Data {
			if tx.IsGenesis {
				continue
			}
			if tx.Sender == address {
				sent += tx.Amount
			}
			if tx.Receiver == address {
				received += tx.Amount
			}
		}
	}

	// Also check pending mempool transactions
	for _, tx := range blockchain.Mempool {
		if tx.Sender == address {
			sent += tx.Amount
		}
		if tx.Receiver == address {
			received += tx.Amount
		}
	}

	balance = 1000.0 + received - sent // Every wallet starts with 1000 OGZ

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"address":  address,
		"balance":  balance,
		"sent":     sent,
		"received": received,
	})
}

// handleGetMempool returns pending transactions
func handleGetMempool(w http.ResponseWriter, r *http.Request) {
	blockchain.mu.Lock()
	defer blockchain.mu.Unlock()
	
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(blockchain.Mempool); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

// handlePostTransaction adds a transaction to the mempool
func handlePostTransaction(w http.ResponseWriter, r *http.Request) {
	// Authenticate user from context
	email, ok := r.Context().Value(userContextKey).(string)
	if !ok {
		http.Error(w, "Unauthorized access", http.StatusUnauthorized)
		return
	}

	userStore.mu.Lock()
	user, exists := userStore.Users[email]
	userStore.mu.Unlock()

	if !exists {
		http.Error(w, "User not found", http.StatusUnauthorized)
		return
	}

	var tx Transaction
	if err := json.NewDecoder(r.Body).Decode(&tx); err != nil {
		log.Printf("Error decoding transaction: %v", err)
		http.Error(w, "Invalid transaction data", http.StatusBadRequest)
		return
	}
	
	// Force the sender to be the authenticated user's wallet address
	tx.Sender = user.WalletAddress
	
	// Forbid self-transfer
	if tx.Receiver == tx.Sender {
		http.Error(w, "Cannot send OGZ to your own wallet", http.StatusBadRequest)
		return
	}

	if tx.Receiver == "" || tx.Amount <= 0 {
		log.Printf("Invalid transaction fields: %+v", tx)
		http.Error(w, "Missing or invalid transaction fields", http.StatusBadRequest)
		return
	}
	
	tx.Timestamp = time.Now().Format(time.RFC3339)
	
	blockchain.mu.Lock()
	blockchain.Mempool = append(blockchain.Mempool, tx)
	blockchain.saveChain()
	blockchain.mu.Unlock()
	
	log.Printf("Transaction queued by %s: %s -> %s (%.2f OGZ)", user.Username, tx.Sender, tx.Receiver, tx.Amount)
	
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode(tx)
}

// handleMineBlock processes pending transactions into a new block
func handleMineBlock(w http.ResponseWriter, r *http.Request) {
	blockchain.mu.Lock()
	defer blockchain.mu.Unlock()

	if len(blockchain.Mempool) == 0 {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("No transactions in mempool to mine"))
		return
	}

	prevBlock := blockchain.Blocks[len(blockchain.Blocks)-1]
	newBlock := &Block{
		Position:  prevBlock.Position + 1,
		Data:      blockchain.Mempool,
		Timestamp: time.Now().Format(time.RFC3339),
		PrevHash:  prevBlock.Hash,
		Nonce:     0,
	}

	// Find valid hash
	mineBlock(newBlock)

	blockchain.Blocks = append(blockchain.Blocks, newBlock)
	blockchain.Mempool = []Transaction{} // Clear mempool
	blockchain.saveChain()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(newBlock)
}

// handleHealth returns a simple health check response
func handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status": "healthy",
		"message": "Onigiri.Z Enterprise Node is running",
	})
}
