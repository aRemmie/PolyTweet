package storage

import (
	"fmt"

	"github.com/kelseyhightower/envconfig"
)

type Config struct {
	MasterURL    string `envconfig:"SEAWEEDFS_MASTER_URL" required:"true"`
	PublicURL    string `envconfig:"SEAWEEDFS_PUBLIC_URL" required:"true"`
	VolumeServer string `envconfig:"SEAWEEDFS_VOLUME_SERVER" required:"true"`
}

func NewConfig() (*Config, error) {
	var cfg Config
	if err := envconfig.Process("", &cfg); err != nil {
		return nil, fmt.Errorf("process env config: %w", err)
	}
	return &cfg, nil
}

func NewConfigMust() *Config {
	cfg, err := NewConfig()
	if err != nil {
		panic(err)
	}
	return cfg
}
