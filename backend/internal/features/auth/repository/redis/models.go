package auth_cache

import (
	"database/sql"
	"encoding/json"
	"time"
)

type UserModel struct {
	ID         string         `redis:"id"`
	Username   string         `redis:"username"`
	Email      string         `redis:"email"`
	Password   string         `redis:"password"`
	Role       string         `redis:"role"`
	AvatarURL  sql.NullString `redis:"avatar_url"`
	Bio        sql.NullString `redis:"bio"`
	Follows    string         `redis:"follows"`
	FollowedBy string         `redis:"followed_by"`
	CreatedAt  time.Time      `redis:"createdAt"`
}

func (m *UserModel) SetFollows(follows []string) error {
	data, err := json.Marshal(follows)
	if err != nil {
		return err
	}
	m.Follows = string(data)
	return nil
}

func (m *UserModel) GetFollows() ([]string, error) {
	if m.Follows == "" {
		return []string{}, nil
	}
	var follows []string
	err := json.Unmarshal([]byte(m.Follows), &follows)
	if err != nil {
		return nil, err
	}
	return follows, nil
}

func (m *UserModel) SetFollowedBy(followedBy []string) error {
	data, err := json.Marshal(followedBy)
	if err != nil {
		return err
	}
	m.FollowedBy = string(data)
	return nil
}

func (m *UserModel) GetFollowedBy() ([]string, error) {
	if m.FollowedBy == "" {
		return []string{}, nil
	}
	var followedBy []string
	err := json.Unmarshal([]byte(m.FollowedBy), &followedBy)
	if err != nil {
		return nil, err
	}
	return followedBy, nil
}
