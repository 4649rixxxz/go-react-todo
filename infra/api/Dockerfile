FROM golang:1.17-alpine

ENV GO111MODULE=on

RUN apk upgrade --update && apk add git
 
RUN go install github.com/cosmtrek/air@latest
