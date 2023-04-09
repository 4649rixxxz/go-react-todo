package main

import (
	"log"
	"todo/controllers"
	"todo/database"
	"todo/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func loadENV() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	loadENV()
	database.Connect()
	database.RunMigration()

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowAllOrigins: false,
		AllowOrigins: []string{
			"http://localhost:3000",
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type"},
		AllowCredentials: true,
	}))

	v1 := r.Group("/v1")
	{
		userController := controllers.NewUserController()
		v1.POST("/signup", userController.SignUP)
		v1.POST("/login", userController.Login)
		v1.POST("/logout", userController.Logout)

		authController := controllers.NewAuthController()
		// 認証されているかを確認できるエンドポイント
		v1.GET("/auth", middleware.Auth(), authController.Auth)
		// 認証されているユーザのみがリクエストできる
		todos := v1.Group("/todos", middleware.Auth())
		{
			todoController := controllers.NewTodoController()
			todos.GET("", todoController.Index)
			todos.POST("", todoController.Create)
			todos.PATCH("/:todo_id", todoController.Update)
			todos.DELETE("/:todo_id", todoController.Delete)
			todos.PATCH("/:todo_id/complete", todoController.Complete)
			todos.PATCH("/:todo_id/uncomplete", todoController.Uncomplete)
		}
	}

	r.Run()
	database.Close()
}
