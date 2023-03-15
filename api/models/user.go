package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	UserID    uint           `gorm:"primaryKey" json:"user_id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
	Email     string         `gorm:"unique" json:"email"`
	Password  string         `gorm:"unique" json:"password"`
	Todos     []Todo         `gorm:"foreignKey:UserID" json:"todos,omitempty"`
}
