package handlers

import (
	"TrustAi/backend/models"
	"encoding/json"
	"net/http"
)

func GetTestData(w http.ResponseWriter, r *http.Request) {
    fruits := []models.TestData{
        {ID: 3, Width: 300, Color: "bg-red-500", Score: 4, Label: "橘子"},
        {ID: 4, Width: 2500, Color: "bg-green-500", Score: 0.2, Label: "檸檬"},
    }

    jsonData, err := json.Marshal(fruits)
    if err != nil {
        http.Error(w, "Error encoding JSON", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    _, err = w.Write(jsonData)
    if err != nil {
        http.Error(w, "Error writing response", http.StatusInternalServerError)
        return
    }
}
