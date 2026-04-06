package main

import (
	"sync"
)

const (
	blockchainFile = "blockchain.json"
	difficulty     = 4 // Number of leading zeros required for PoW
)

// Transaction represents a single transfer of value
type Transaction struct {
	Sender    string  `json:"sender"`
	Receiver  string  `json:"receiver"`
	Amount    float64 `json:"amount"`
	Timestamp string  `json:"timestamp"`
	IsGenesis bool    `json:"is_genesis"`
}

// Block represents a single block in the chain
type Block struct {
	Position  int64         `json:"position"`
	Data      []Transaction `json:"data"` // Multiple transactions per block
	Timestamp string        `json:"timestamp"`
	Hash      string        `json:"hash"`
	PrevHash  string        `json:"prev_hash"`
	Nonce     int           `json:"nonce"`
}

// User represents a registered participant in the network
type User struct {
	Email         string `json:"email"`
	Username      string `json:"username"`
	PasswordHash  string `json:"password_hash"`
	WalletAddress string `json:"wallet_address"`
}

// BlockChain is the structure holding the blocks and pending transactions
type BlockChain struct {
	Blocks  []*Block      `json:"blocks"`
	Mempool []Transaction `json:"mempool"`
	mu      sync.Mutex
}
