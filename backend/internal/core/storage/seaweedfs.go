package storage

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"path/filepath"
)

type SeaweedFSClient struct {
	masterURL    string
	publicURL    string
	volumeServer string
	client       *http.Client
}

type AssignResponse struct {
	Fid       string `json:"fid"`
	URL       string `json:"url"`
	PublicURL string `json:"publicUrl"`
	Count     int    `json:"count"`
}

func NewSeaweedFSClient(masterURL, publicURL, volumeServer string) *SeaweedFSClient {
	return &SeaweedFSClient{
		masterURL:    masterURL,
		publicURL:    publicURL,
		volumeServer: volumeServer,
		client:       &http.Client{},
	}
}

func (s *SeaweedFSClient) UploadFile(file multipart.File, filename string) (string, error) {
	assignResp, err := s.assignFileID()
	if err != nil {
		return "", fmt.Errorf("assign file id: %w", err)
	}

	fileURL, err := s.uploadToVolume(assignResp, file, filename)
	if err != nil {
		return "", fmt.Errorf("upload to volume: %w", err)
	}

	return fileURL, nil
}

func (s *SeaweedFSClient) assignFileID() (*AssignResponse, error) {
	resp, err := s.client.Get(fmt.Sprintf("%s/dir/assign", s.masterURL))
	if err != nil {
		return nil, fmt.Errorf("request assign: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("assign failed with status: %d", resp.StatusCode)
	}

	var assignResp AssignResponse
	if err := json.NewDecoder(resp.Body).Decode(&assignResp); err != nil {
		return nil, fmt.Errorf("decode assign response: %w", err)
	}

	return &assignResp, nil
}

func (s *SeaweedFSClient) uploadToVolume(assign *AssignResponse, file multipart.File, filename string) (string, error) {
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	part, err := writer.CreateFormFile("file", filepath.Base(filename))
	if err != nil {
		return "", fmt.Errorf("create form file: %w", err)
	}

	if _, err := io.Copy(part, file); err != nil {
		return "", fmt.Errorf("copy file: %w", err)
	}

	if err := writer.Close(); err != nil {
		return "", fmt.Errorf("close writer: %w", err)
	}

	uploadURL := fmt.Sprintf("http://%s/%s", s.volumeServer, assign.Fid)
	req, err := http.NewRequest("POST", uploadURL, body)
	if err != nil {
		return "", fmt.Errorf("create request: %w", err)
	}

	req.Header.Set("Content-Type", writer.FormDataContentType())

	resp, err := s.client.Do(req)
	if err != nil {
		return "", fmt.Errorf("upload request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("upload failed with status: %d", resp.StatusCode)
	}

	publicURL := fmt.Sprintf("%s/%s", s.publicURL, assign.Fid)
	return publicURL, nil
}
