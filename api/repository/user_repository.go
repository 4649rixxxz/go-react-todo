package repository

import (
	"todo/database"
	"todo/models"

	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository() *UserRepository {
	return &UserRepository{
		db: database.GetDB(),
	}
}

func (userRepository *UserRepository) CreateUser(user *models.User) error {
	return userRepository.db.Create(user).Error
}

func (userRepository *UserRepository) FetchByEmail(user *models.User, email string) error {
	return userRepository.db.First(user, "email = ?", email).Error
}

func (userRepository *UserRepository) FetchByUserID(user *models.User, userID uint) error {
	return userRepository.db.First(user, userID).Error
}
