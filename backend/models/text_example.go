package models

type TestData struct {
    ID    int    `json:"id"`
    Width int    `json:"width"`
    Color string `json:"color"`
    Score float64 `json:"score"`
    Label string `json:"label"`
}
