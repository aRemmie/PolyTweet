package cache

import (
	"fmt"
	"time"

	"github.com/kelseyhightower/envconfig"
)

type Config struct {
	Addr     string        `envconfig:"ADDR" required:"true"`
	Username string        `envconfig:"USERNAME" required:"true"`
	Password string        `envconfig:"PASSWORD" default:""`
	DB       int           `envconfig:"DB" default:"0"`
	Timeout  time.Duration `envconfig:"TIMEOUT" default:"10s"`
}

func NewConfig() (Config, error) {
	var cfg Config

	if err := envconfig.Process("REDIS", &cfg); err != nil {
		return Config{}, fmt.Errorf("envconfig process: %w", err)
	}

	return cfg, nil
}

func NewConfigMust() Config {
	cfg, err := NewConfig()
	if err != nil {
		panic(err)
	}
	return cfg
}
