package log

import (
	"time"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var logger *zap.Logger

func Init() {
	config := zap.NewProductionConfig()
	config.EncoderConfig.TimeKey = "timestamp"
	config.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder

	var err error
	logger, err = config.Build()
	if err != nil {
		panic(err)
	}
}

func SyncLogs() error {
	err := logger.Sync()
	if err != nil {
		return err
	}

	return nil
}

func RequestLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		query := c.Request.URL.RawQuery

		c.Next()

		duration := time.Since(start)

		logger.Info("request",
			zap.Int("status", c.Writer.Status()),
			zap.String("method", c.Request.Method),
			zap.String("path", path),
			zap.String("query", query),
			zap.Duration("duration", duration),
			zap.String("ip", c.ClientIP()),
			zap.String("user-agent", c.Request.UserAgent()),
		)
	}
}

func ErrorLogger(err error, context string, fields ...zapcore.Field) {
	if err == nil {
		return
	}

	fields = append(fields, zap.Error(err))

	logger.Error(context, fields...)
}

func Fatalf(message string, rest ...interface{}) {
	logger.Sugar().Fatalf(message, rest...)
}

func Errorf(message string, rest ...interface{}) {
	logger.Sugar().Errorf(message, rest...)
}

func Errorw(message string, rest ...interface{}) {
	logger.Sugar().Errorw(message, rest...)
}

func Infow(message string, rest ...interface{}) {
	logger.Sugar().Infow(message, rest...)
}
