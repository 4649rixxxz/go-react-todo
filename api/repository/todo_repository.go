package repository

import (
	"todo/config"
	"todo/database"
	"todo/models"

	"gorm.io/gorm"
)

type TodoRepository struct {
	db *gorm.DB
}

func NewTodoRepository() *TodoRepository {
	return &TodoRepository{
		db: database.GetDB(),
	}
}

func (todoRepository *TodoRepository) First(todo *models.Todo, todo_id interface{}) error {
	return todoRepository.db.First(todo, todo_id).Error
}

func (todoRepository *TodoRepository) FetchTodos(user *models.User, status string) error {
	statusConfig := config.GetSearchTodoStatus()
	switch status {
	case statusConfig["completed"]:
		return todoRepository.db.Model(&models.User{}).Preload("Todos", "completed_at is not null").Find(user).Error
	case statusConfig["uncompleted"]:
		return todoRepository.db.Model(&models.User{}).Preload("Todos", "completed_at is null").Find(user).Error
	default:
		return todoRepository.db.Model(&models.User{}).Preload("Todos").Find(user).Error
	}
}

func (todoRepository *TodoRepository) CreateTodo(todo *models.Todo) error {
	return todoRepository.db.Create(todo).Error
}

func (todoRepository *TodoRepository) UpdateTodo(todo *models.Todo, data map[string]interface{}) error {
	return todoRepository.db.Model(todo).Updates(data).Error
}

func (todoRepository *TodoRepository) DeleteTodo(todo *models.Todo) error {
	return todoRepository.db.Delete(todo).Error
}
