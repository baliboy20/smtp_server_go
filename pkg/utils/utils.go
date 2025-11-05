package utils

import (
	"bytes"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/baliboy20/smtp_server_go/internal/models"
)

// GenerateID generates a random unique ID
func GenerateID() string {
	b := make([]byte, 16)
	rand.Read(b)
	return hex.EncodeToString(b)
}

// TriggerWebhook sends email data to a webhook URL
func TriggerWebhook(webhook models.Webhook, email *models.Email) error {
	data, err := json.Marshal(email)
	if err != nil {
		return err
	}

	method := webhook.Method
	if method == "" {
		method = "POST"
	}

	req, err := http.NewRequest(method, webhook.URL, bytes.NewBuffer(data))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	for key, value := range webhook.Headers {
		req.Header.Set(key, value)
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("webhook returned status %d", resp.StatusCode)
	}

	return nil
}
