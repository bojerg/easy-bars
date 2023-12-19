package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Ping struct {
	Id   primitive.ObjectID `json:"id,omitempty"`
	Pong string             `json:"Pong,omitempty" validate:"required"`
}
