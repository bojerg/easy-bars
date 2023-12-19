package controller

import (
	"context"
	"easy-bars/config"
	"easy-bars/model"
	"easy-bars/response"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var pingCollection *mongo.Collection = config.GetCollection(config.DB, "pings")
var validate = validator.New()

func CreatePing() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		var ping model.Ping
		defer cancel()

		//validate the request body
		if err := c.BindJSON(&ping); err != nil {
			c.JSON(http.StatusBadRequest, response.PingResponse{Status: http.StatusBadRequest, Message: "error", Data: map[string]interface{}{"data": err.Error()}})
			return
		}

		//use the validator library to validate required fields
		if validationErr := validate.Struct(&ping); validationErr != nil {
			c.JSON(http.StatusBadRequest, response.PingResponse{Status: http.StatusBadRequest, Message: "error", Data: map[string]interface{}{"data": validationErr.Error()}})
			return
		}

		newPing := model.Ping{
			Id:   primitive.NewObjectID(),
			Pong: ping.Pong,
		}

		result, err := pingCollection.InsertOne(ctx, newPing)
		if err != nil {
			c.JSON(http.StatusInternalServerError, response.PingResponse{Status: http.StatusInternalServerError, Message: "error", Data: map[string]interface{}{"data": err.Error()}})
			return
		}

		c.JSON(http.StatusCreated, response.PingResponse{Status: http.StatusCreated, Message: "success", Data: map[string]interface{}{"data": result}})
	}
}

func GetAPing() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		pingId := c.Param("pingId")
		var ping model.Ping
		defer cancel()

		objId, _ := primitive.ObjectIDFromHex(pingId)

		err := pingCollection.FindOne(ctx, bson.M{"id": objId}).Decode(&ping)
		if err != nil {
			c.JSON(http.StatusInternalServerError, response.PingResponse{Status: http.StatusInternalServerError, Message: "error", Data: map[string]interface{}{"data": err.Error()}})
			return
		}

		c.JSON(http.StatusOK, response.PingResponse{Status: http.StatusOK, Message: "success", Data: map[string]interface{}{"data": ping}})
	}
}
