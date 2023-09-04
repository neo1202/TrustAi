package main

import (
	"TrustAi/backend/handlers"
	"fmt"
	"io"
	"net/http"
	"os"
)

func main() {
	http.HandleFunc("/api/getTestData", handlers.GetTestData)
	http.HandleFunc("/upload", uploadFile)
	port := ":8080"
	fmt.Printf("Server is running on port %s\n", port)
	http.ListenAndServe(":8080", nil)
}

func uploadFile(w http.ResponseWriter, r *http.Request) {
	file, handler, err := r.FormFile("file")
	if err != nil {
		fmt.Println("Error getting file:", err)
		http.Error(w, "Error getting file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Save the uploaded file to a temporary location
	tempFile, err := os.CreateTemp("uploads", handler.Filename)
	if err != nil {
		fmt.Println("Error creating temporary file:", err)
		http.Error(w, "Error creating temporary file", http.StatusInternalServerError)
		return
	}
	defer tempFile.Close()

	// Copy the uploaded file data to the temporary file
	_, err = io.Copy(tempFile, file)
	if err != nil {
		fmt.Println("Error copying file:", err)
		http.Error(w, "Error copying file", http.StatusInternalServerError)
		return
	}

	fmt.Println("File uploaded successfully")
	w.WriteHeader(http.StatusOK)
}
