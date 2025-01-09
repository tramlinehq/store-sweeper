package lib

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/tramlinehq/store-sweeper/utils"
)

func SearchAppStore(options SearchOptions) ([]AppStoreSearchResult, error) {
	if options.SearchTerm == "" {
		return nil, errors.New("searchTerm parameter is required")
	}

	if options.NumCount <= 0 {
		return nil, errors.New("numCount parameter must be greater than zero")
	}

	country := options.Country
	if country == 0 {
		country = countryCodes["US"]
	}

	language := options.Language
	if language == "" {
		language = "en-us"
	}

	searchURL := fmt.Sprintf("%s%s", BASE_SEARCH_URL, url.QueryEscape(options.SearchTerm))

	req, err := http.NewRequest(http.MethodGet, searchURL, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %v", err)
	}

	// Set headers
	req.Header.Set("X-Apple-Store-Front", fmt.Sprintf("%d,24 t:native", country))
	req.Header.Set("Accept-Language", language)

	client := &http.Client{
		Timeout: 2 * time.Second,
	}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %v", err)
	}

	var parsedResponse struct {
		Bubbles []struct {
			Results []struct {
				ID string `json:"id"`
			} `json:"results"`
		} `json:"bubbles"`
	}

	err = json.Unmarshal(body, &parsedResponse)
	if err != nil {
		return nil, fmt.Errorf("failed to parse response: %v", err)
	}

	results := parsedResponse.Bubbles[0].Results
	if len(results) == 0 {
		return nil, nil
	}

	ids := make([]string, options.NumCount)
	for i, result := range results {
		if i >= options.NumCount {
			break
		}
		ids[i] = result.ID
	}

	// Perform lookup to get detailed app information
	return lookupAppStoreById(ids)
}

func lookupAppStoreById(ids []string) ([]AppStoreSearchResult, error) {
	lookupURL := LOOKUP_APP_ID_URL + strings.Join(ids, ",")

	req, err := http.NewRequest(http.MethodGet, lookupURL, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create lookup request: %v", err)
	}

	client := &http.Client{
		Timeout: 5 * time.Second,
	}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to make lookup request: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read lookup response body: %v", err)
	}

	var parsedLookupResponse struct {
		Results []AppData `json:"results"`
	}

	err = json.Unmarshal(body, &parsedLookupResponse)
	if err != nil {
		return nil, fmt.Errorf("failed to parse lookup response: %v", err)
	}

	fmt.Println(parsedLookupResponse.Results)

	return utils.Map(parsedLookupResponse.Results, convertToSearchResult), nil
}

func convertToSearchResult(data AppData) AppStoreSearchResult {
	return AppStoreSearchResult{
		ID:            data.TrackID,
		Name:          data.TrackName,
		BundleID:      data.BundleID,
		DeveloperName: data.ArtistName,
		Version:       data.Version,
		Rating:        data.AverageUserRating,
		IconURL:       data.ArtworkURL100,
		Description:   data.Description,
	}
}
