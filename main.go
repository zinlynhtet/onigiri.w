package main

import (
	"log"
	"net/http"
	"github.com/gorilla/mux"
	"crypto/md5"
	"crypto/sha256"
	"io"
	"fmt"
	"time"
	"encoding/json"
	"encoding/hex"
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

func newBook(w http.ResponseWriter, r *http.Request){
	var book Book
	if err := json.NewDecoder(r.Body).Decode(&book); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Printf("Could not decode JSON: %v", err)
		w.Write([]byte("Could not create a new book"))
		return
	}
	h := md5.New()
	io.WriteString(h, book.ISBN + book.PublishedDate)
	book.Id = fmt.Sprintf("%x", h.Sum(nil))
	
}

func writeBlocks(w http.ResponseWriter, r *http.Request){
	
}

func getBlockchain(w http.ResponseWriter, r *http.Request){
	
}

func main(){
	r := mux.NewRouter()
	r.HandleFunc("/", getBlockchain).Methods("GET")
	r.HandleFunc("/", writeBlocks).Methods("POST")
	r.HandleFunc("/new", newBook).Methods("POST")
	log.Fatal(http.ListenAndServe(":8080", r))	
}