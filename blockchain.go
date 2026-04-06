package main

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"
	"time"
)

// calculateHash creates a SHA256 hash for the block including nonce
func calculateHash(block *Block) string {
	bytes, _ := json.Marshal(block.Data)
	data := fmt.Sprintf("%d", block.Position) + block.Timestamp + block.PrevHash + string(bytes) + fmt.Sprintf("%d", block.Nonce)
	h := sha256.New()
	h.Write([]byte(data))
	return hex.EncodeToString(h.Sum(nil))
}

// mineBlock performs Proof of Work to find a valid hash
func mineBlock(block *Block) {
	target := strings.Repeat("0", difficulty)
	for {
		block.Hash = calculateHash(block)
		if strings.HasPrefix(block.Hash, target) {
			break
		}
		block.Nonce++
	}
}

// saveChain writes the blockchain to a local JSON file
func (bc *BlockChain) saveChain() {
	data, err := json.MarshalIndent(bc, "", "  ")
	if err != nil {
		log.Printf("Error marshaling blockchain: %v", err)
		return
	}
	err = os.WriteFile(blockchainFile, data, 0644)
	if err != nil {
		log.Printf("Error saving blockchain: %v", err)
	}
}

// loadChain reads the blockchain from a local JSON file
func loadChain() *BlockChain {
	data, err := os.ReadFile(blockchainFile)
	if err != nil {
		return nil
	}
	var bc BlockChain
	err = json.Unmarshal(data, &bc)
	if err != nil {
		log.Printf("Error unmarshaling blockchain: %v", err)
		return nil
	}
	return &bc
}

// initBlockchain initializes a new blockchain or loads an existing one
func initBlockchain() *BlockChain {
	bc := loadChain()
	if bc != nil {
		fmt.Println("Loaded existing blockchain from storage.")
		return bc
	}

	fmt.Println("Initializing new blockchain...")
	genesisBlock := &Block{
		Position: 0,
		Data: []Transaction{{
			Sender:    "Genesis",
			Receiver:  "Network",
			Amount:    0,
			IsGenesis: true,
			Timestamp: time.Now().Format(time.RFC3339),
		}},
		Timestamp: time.Now().Format(time.RFC3339),
		PrevHash:  "0",
		Nonce:     0,
	}
	mineBlock(genesisBlock)
	
	newBc := &BlockChain{
		Blocks:  []*Block{genesisBlock},
		Mempool: []Transaction{},
	}
	newBc.saveChain()
	return newBc
}
