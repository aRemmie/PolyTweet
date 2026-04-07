FROM golang:1.26-alpine AS builder

WORKDIR /build

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 go build -o polytweet cmd/polytweet/main.go

FROM alpine:3.23 AS final

WORKDIR /app

COPY --from=builder /build/polytweet .

COPY --from=builder /build/.env .

CMD [ "/app/polytweet" ]