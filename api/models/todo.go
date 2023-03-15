package models

import (
	"time"

	"gorm.io/gorm"
)

type Todo struct {
	TodoID      uint           `gorm:"primaryKey" json:"todo_id"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	UserID      uint           `json:"user_id"`
	Label       string         `gorm:"not null" json:"label"`
	CompletedAt *time.Time     `gorm:"default: null" json:"completed_at"`
}
