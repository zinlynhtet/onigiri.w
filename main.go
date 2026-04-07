package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

var blockchain *BlockChain

// CORSMiddleware allows cross-origin requests from the GitHub Pages frontend
func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := os.Getenv("ALLOWED_ORIGIN")
		if origin == "" {
			origin = "*" // Allow all origins in dev mode
		}
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		// Handle preflight OPTIONS request
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	// Initialize blockchain (loads from file if exists, otherwise creates genesis)
	blockchain = initBlockchain()

	// Initialize user store
	initUserStore()

	r := mux.NewRouter()

	// Public API Routes
	r.HandleFunc("/api/register", handleRegister).Methods("POST", "OPTIONS")
	r.HandleFunc("/api/login", handleLogin).Methods("POST", "OPTIONS")
	r.HandleFunc("/api/request-reset", handleRequestReset).Methods("POST", "OPTIONS")
	r.HandleFunc("/api/reset-password", handleResetPassword).Methods("POST", "OPTIONS")
	r.HandleFunc("/api/blockchain", handleGetBlockchain).Methods("GET", "OPTIONS")
	r.HandleFunc("/api/balance/{address}", handleGetBalance).Methods("GET", "OPTIONS")
	r.HandleFunc("/api/health", handleHealth).Methods("GET", "OPTIONS")

	// Protected API Routes
	api := r.PathPrefix("/api").Subrouter()
	api.Use(AuthMiddleware)
	api.HandleFunc("/mempool", handleGetMempool).Methods("GET", "OPTIONS")
	api.HandleFunc("/transaction", handlePostTransaction).Methods("POST", "OPTIONS")
	api.HandleFunc("/mine", handleMineBlock).Methods("POST", "OPTIONS")

	// Serve Vite-built frontend
	r.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(http.Dir("./frontend/dist/"))))

	// Wrap entire router with CORS middleware
	handler := CORSMiddleware(r)

	// Get port from environment variable, default to 8080 for local development
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	addr := ":" + port
	fmt.Printf("Onigiri.Z Enterprise Node started on http://localhost:%s (Difficulty: %d)\n", port, difficulty)
	log.Fatal(http.ListenAndServe(addr, handler))
}
