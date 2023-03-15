package middleware

import (
	"fmt"
	"net/http"
	"os"
	"time"
	"todo/models"
	"todo/repository"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		// cookieを取得
		tokenString, err := c.Cookie("Authorization")
		if err != nil {
			fmt.Println("no cookie")
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		// トークンの検証
		fmt.Println("Decode and Validate token")
		token, tokenErr := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
			}

			return []byte(os.Getenv("SECRET")), nil
		})

		if tokenErr != nil {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			// 有効期限の検証
			if float64(time.Now().Unix()) > claims["exp"].(float64) {
				c.AbortWithStatus(http.StatusUnauthorized)
				return
			}
			// ユーザの取得
			userRepository := repository.NewUserRepository()
			var user models.User
			if err := userRepository.FetchByUserID(&user, uint(claims["user_id"].(float64))); err != nil || user.UserID == 0 {
				c.AbortWithStatus(http.StatusUnauthorized)
				return
			}
			c.Set("user_id", user.UserID)
			// コントローラ処理へ
			c.Next()
			// コントローラの後処理が必要な場合はこれ以降に書く
		} else {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}
	}
}
