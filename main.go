package main

import (
	"log"
	"net/http"
	"github.com/gorilla/mux"
)

type Block struct {
	Position int64
	Data BookCheckout
	Timestamp string
	Hash string
	PrevHash string
}

type Book struct {
	Id  string `json:"id"`
	Title string `json:"title"`
	Author string `json:"author"`
	PublishedDate string `json:"published_date"`
	ISBN string `json:"isbn"`
}

type BookCheckout struct {
	BookId string `json:"book_id"`
	User string `json:"user"`
	CheckoutDate string `json:"checkout_date"`
	IsGenesis bool `json:"is_genesis"`
}

type BlockChain struct {
	blocks []*Block
}

var blockchain *BlockChain

func main(){
	r := mux.NewRouter()
	r.HandleFunc("/", getBlockchain).Methods("GET")
	r.HandleFunc("/", writeBlocks).Methods("POST")
	r.HandleFunc("/new", newBook).Methods("POST")
	log.Fatal(http.ListenAndServe(":8080", r))	
}