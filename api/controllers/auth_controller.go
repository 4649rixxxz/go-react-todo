package controllers

import (
	"net/http"
	"todo/models"
	"todo/repository"

	"github.com/gin-gonic/gin"
)

type AuthController struct {
	userRepository *repository.UserRepository
}

func NewAuthController() *AuthController {
	return &AuthController{
		userRepository: repository.NewUserRepository(),
	}
}

func (authController *AuthController) Auth(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var user models.User
	if err := authController.userRepository.FetchByUserID(&user, userID.(uint)); err != nil || user.UserID == 0 {
		c.JSON(http.StatusOK, gin.H{
			"user": nil,
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"user_id": user.UserID,
	})
}
