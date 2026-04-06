package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

var blockchain *BlockChain

func main() {
	// Initialize blockchain (loads from file if exists, otherwise creates genesis)
	blockchain = initBlockchain()
	
	// Initialize user store
	initUserStore()

	r := mux.NewRouter()

	// Public API Routes
	r.HandleFunc("/api/register", handleRegister).Methods("POST")
	r.HandleFunc("/api/login", handleLogin).Methods("POST")
	r.HandleFunc("/api/request-reset", handleRequestReset).Methods("POST")
	r.HandleFunc("/api/reset-password", handleResetPassword).Methods("POST")
	r.HandleFunc("/api/blockchain", handleGetBlockchain).Methods("GET")
	r.HandleFunc("/api/balance/{address}", handleGetBalance).Methods("GET")

	// Protected API Routes
	api := r.PathPrefix("/api").Subrouter()
	api.Use(AuthMiddleware)
	api.HandleFunc("/mempool", handleGetMempool).Methods("GET")
	api.HandleFunc("/transaction", handlePostTransaction).Methods("POST")
	api.HandleFunc("/mine", handleMineBlock).Methods("POST")

	// Serve Vite-built frontend
	r.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(http.Dir("./frontend/dist/"))))

	fmt.Printf("Onigiri.Z Enterprise Node started on http://localhost:8080 (Difficulty: %d)\n", difficulty)
	log.Fatal(http.ListenAndServe(":8080", r))
}