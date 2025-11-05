package storage

import (
	"encoding/json"
	"fmt"
	"os"
	"sync"
	"time"

	"github.com/baliboy20/smtp_server_go/internal/models"
)

// Storage interface defines email storage operations
type Storage interface {
	Save(email *models.Email) error
	Get(id string) (*models.Email, error)
	List() ([]*models.Email, error)
	Delete(id string) error
	Clear() error
	Stats() *models.Stats
}

// MemoryStorage implements in-memory email storage
type MemoryStorage struct {
	mu            sync.RWMutex
	emails        map[string]*models.Email
	emailOrder    []string
	maxEmails     int
	serverStarted time.Time
}

// NewMemoryStorage creates a new in-memory storage
func NewMemoryStorage(maxEmails int, serverStarted time.Time) *MemoryStorage {
	return &MemoryStorage{
		emails:        make(map[string]*models.Email),
		emailOrder:    make([]string, 0),
		maxEmails:     maxEmails,
		serverStarted: serverStarted,
	}
}

func (s *MemoryStorage) Save(email *models.Email) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Check max emails limit
	if len(s.emails) >= s.maxEmails {
		// Remove oldest email
		if len(s.emailOrder) > 0 {
			oldestID := s.emailOrder[0]
			delete(s.emails, oldestID)
			s.emailOrder = s.emailOrder[1:]
		}
	}

	s.emails[email.ID] = email
	s.emailOrder = append(s.emailOrder, email.ID)
	return nil
}

func (s *MemoryStorage) Get(id string) (*models.Email, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	email, exists := s.emails[id]
	if !exists {
		return nil, fmt.Errorf("email not found")
	}
	return email, nil
}

func (s *MemoryStorage) List() ([]*models.Email, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	emails := make([]*models.Email, 0, len(s.emails))
	// Return in reverse order (newest first)
	for i := len(s.emailOrder) - 1; i >= 0; i-- {
		if email, exists := s.emails[s.emailOrder[i]]; exists {
			emails = append(emails, email)
		}
	}
	return emails, nil
}

func (s *MemoryStorage) Delete(id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, exists := s.emails[id]; !exists {
		return fmt.Errorf("email not found")
	}

	delete(s.emails, id)

	// Remove from order slice
	for i, eid := range s.emailOrder {
		if eid == id {
			s.emailOrder = append(s.emailOrder[:i], s.emailOrder[i+1:]...)
			break
		}
	}

	return nil
}

func (s *MemoryStorage) Clear() error {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.emails = make(map[string]*models.Email)
	s.emailOrder = make([]string, 0)
	return nil
}

func (s *MemoryStorage) Stats() *models.Stats {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var totalSize int64
	var lastEmailAt time.Time

	for _, email := range s.emails {
		totalSize += email.Size
		if email.ReceivedAt.After(lastEmailAt) {
			lastEmailAt = email.ReceivedAt
		}
	}

	return &models.Stats{
		TotalEmails:   len(s.emails),
		TotalSize:     totalSize,
		LastEmailAt:   lastEmailAt,
		ServerStarted: s.serverStarted,
	}
}

// FileStorage implements file-based email storage
type FileStorage struct {
	*MemoryStorage
	filename string
}

// NewFileStorage creates a new file-based storage
func NewFileStorage(filename string, maxEmails int, serverStarted time.Time) (*FileStorage, error) {
	fs := &FileStorage{
		MemoryStorage: NewMemoryStorage(maxEmails, serverStarted),
		filename:      filename,
	}

	// Load existing emails from file
	if err := fs.load(); err != nil && !os.IsNotExist(err) {
		return nil, err
	}

	return fs, nil
}

func (fs *FileStorage) Save(email *models.Email) error {
	if err := fs.MemoryStorage.Save(email); err != nil {
		return err
	}
	return fs.persist()
}

func (fs *FileStorage) Delete(id string) error {
	if err := fs.MemoryStorage.Delete(id); err != nil {
		return err
	}
	return fs.persist()
}

func (fs *FileStorage) Clear() error {
	if err := fs.MemoryStorage.Clear(); err != nil {
		return err
	}
	return fs.persist()
}

func (fs *FileStorage) load() error {
	data, err := os.ReadFile(fs.filename)
	if err != nil {
		return err
	}

	var emails []*models.Email
	if err := json.Unmarshal(data, &emails); err != nil {
		return err
	}

	fs.mu.Lock()
	defer fs.mu.Unlock()

	for _, email := range emails {
		fs.emails[email.ID] = email
		fs.emailOrder = append(fs.emailOrder, email.ID)
	}

	return nil
}

func (fs *FileStorage) persist() error {
	emails, _ := fs.List()

	data, err := json.MarshalIndent(emails, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(fs.filename, data, 0644)
}
