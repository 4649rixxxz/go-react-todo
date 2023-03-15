package database

import "todo/models"

func RunMigration() {
	db.AutoMigrate(&models.User{})
	db.AutoMigrate(&models.Todo{})
}
