package middleware

import (
	"fmt"
	"net/http"

	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/tramlinehq/store-sweeper/config"
)

func SetEnv() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("isProduction", config.C.AppEnv == "production")
		c.Next()
	}
}

func ApiAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")

		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is missing"})
			c.Abort()
			return
		}

		const prefix = "Bearer "
		if !strings.HasPrefix(authHeader, prefix) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization format"})
			c.Abort()
			return
		}

		tokenString := authHeader[len(prefix):]

		authSecret := config.C.AuthConfig.Secret

		token, err := verifyToken(authSecret, tokenString)

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		claims, err := checkTokenClaims(token)

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		c.Set("claims", claims)
		c.Next()
	}
}

func verifyToken(authSecret, tokenString string) (*jwt.Token, error) {
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return authSecret, nil
	})

	if err != nil {
		return nil, fmt.Errorf("error parsing token: %w", err)
	}

	return token, nil
}

func checkTokenClaims(token *jwt.Token) (jwt.MapClaims, error) {
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// Verify expiration (exp)
		if exp, ok := claims["exp"].(float64); ok {
			if time.Now().Unix() > int64(exp) {
				return nil, fmt.Errorf("token expired")
			} else {
				return claims, nil
			}
		}

		// Verify issuer (iss)
		if iss, ok := claims["iss"].(string); ok {
			expectedIssuer := config.C.AuthConfig.Issuer
			if iss != expectedIssuer {
				return nil, fmt.Errorf("invalid issuer")
			}
		}

		// Verify audience (aud)
		if aud, ok := claims["aud"].(string); ok {
			expectedAudience := config.C.AuthConfig.Audience
			if aud != expectedAudience {
				return nil, fmt.Errorf("invalid audience")
			}
		}
	} else {
		return nil, fmt.Errorf("invalid token claims")
	}
	return nil, nil
}
