package domain

import (
	"fmt"
	"strings"
	"unicode/utf8"

	"github.com/go-playground/validator/v10"
)

type Search struct {
	Query      string `validate:"required"`
	Pagination PaginationParams
}

func (s *Search) Validate() error {
	validator := validator.New()

	if err := validator.Struct(s); err != nil {
		return fmt.Errorf("validate search struct: %w", err)
	}

	length := utf8.RuneCountInString(s.Query)
	if length < 1 || length > 100 {
		return fmt.Errorf("search query must be between 1 and 100 characters, got %d", length)
	}

	return nil
}

func ParseSearchQuery(query string) string {
	query = strings.TrimSpace(query)
	if query == "" {
		return ""
	}

	words := strings.Fields(query)

	for i, word := range words {
		words[i] = strings.ToLower(word)

		safeWord := strings.Map(func(r rune) rune {
			if r == ':' || r == '&' || r == '|' || r == '!' ||
				r == '(' || r == ')' || r == '<' || r == '>' ||
				r == '@' || r == '#' || r == '$' {
				return -1
			}
			return r
		}, word)

		if len(safeWord) > 0 {
			words[i] = safeWord + ":*"
		}
	}

	return strings.Join(words, " & ")
}
