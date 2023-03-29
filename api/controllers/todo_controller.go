package controllers

import (
	"fmt"
	"net/http"
	"time"
	"todo/models"
	"todo/repository"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type TodoController struct {
	userRepository *repository.UserRepository
	todoRepository *repository.TodoRepository
}

func NewTodoController() *TodoController {
	return &TodoController{
		userRepository: repository.NewUserRepository(),
		todoRepository: repository.NewTodoRepository(),
	}
}

func (todoController *TodoController) Index(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var user models.User
	todoController.userRepository.FetchByUserID(&user, userID.(uint))
	status := c.Query("status")
	if err := todoController.todoRepository.FetchTodos(&user, status); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "failed to get todo",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"todos": user.Todos,
	})
}

type CreateRequest struct {
	Label string `json:"label" binding:"required,max=20"`
}

func (todoController *TodoController) Create(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var body CreateRequest

	if err := c.ShouldBindJSON(&body); err != nil {
		var errMessage string
		// 型アサーション
		switch err.(type) {
		case validator.ValidationErrors:
			// 一つ目の変数「_」はindexが入るが使用しないため「_」となっている
			for _, fieldError := range err.(validator.ValidationErrors) {
				// bindingタグのどのタグ情報に引っかかったかを判定
				switch fieldError.Tag() {
				case "required":
					errMessage = "必須です"
				case "max":
					errMessage = fmt.Sprintf("最大文字数は%s文字です", fieldError.Param())
				default:
					errMessage = "不正です"
				}
			}
		}
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errMessage,
		})
		return
	}

	todo := models.Todo{
		UserID: userID.(uint),
		Label:  body.Label,
	}

	if err := todoController.todoRepository.CreateTodo(&todo); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "failed to create todo",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"todo": todo,
	})
}

func (todoController *TodoController) Update(c *gin.Context) {
	var body struct {
		Label string
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})

		return
	}

	var todo models.Todo
	if err := todoController.todoRepository.First(&todo, c.Param("todo_id")); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "failed to fetch todo",
		})
		return
	}
	data := map[string]interface{}{
		"label": body.Label,
	}
	if err := todoController.todoRepository.UpdateTodo(&todo, data); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "failed to update todo",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"todo": todo,
	})
}

func (todoController *TodoController) Delete(c *gin.Context) {
	var todo models.Todo
	if err := todoController.todoRepository.First(&todo, c.Param("todo_id")); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "failed to fetch todo",
		})
		return
	}
	if err := todoController.todoRepository.DeleteTodo(&todo); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "failed to delete todo",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{})
}

func (todoController *TodoController) Complete(c *gin.Context) {
	var todo models.Todo
	if err := todoController.todoRepository.First(&todo, c.Param("todo_id")); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "failed to fetch todo",
		})
		return
	}
	// すでに完了している場合
	if todo.CompletedAt != nil {
		c.AbortWithStatusJSON(http.StatusOK, gin.H{
			"msg": "already completed",
		})
		return
	}
	data := map[string]interface{}{
		"completed_at": time.Now(),
	}
	if err := todoController.todoRepository.UpdateTodo(&todo, data); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "failed to complete todo",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"todo": todo,
	})
}

func (todoController *TodoController) Uncomplete(c *gin.Context) {
	var todo models.Todo
	if err := todoController.todoRepository.First(&todo, c.Param("todo_id")); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "failed to fetch todo",
		})
		return
	}
	// 完了していない場合
	if todo.CompletedAt == nil {
		c.AbortWithStatusJSON(http.StatusOK, gin.H{
			"msg": "completed yet",
		})
		return
	}
	data := map[string]interface{}{
		"completed_at": nil,
	}
	if err := todoController.todoRepository.UpdateTodo(&todo, data); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "failed to uncomplete todo",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"todo": todo,
	})
}
