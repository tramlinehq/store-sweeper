package lib

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/tramlinehq/store-sweeper/config"
	"github.com/tramlinehq/store-sweeper/utils"
)

func ConstructPlayStoreSearchOptions(ctx *gin.Context) (*PlayStoreSearchOptions, error) {
	searchTerm := ctx.Query("searchTerm")

	if searchTerm == "" {
		return nil, errors.New("searchTerm query parameter is required")
	}

	numCount, err := strconv.Atoi(ctx.DefaultQuery("resultCount", "10"))

	if err != nil {
		return nil, errors.New("resultCount query parameter must be an integer")
	}

	lang := ctx.DefaultQuery("lang", "en")

	country := ctx.DefaultQuery("country", "us")

	return &PlayStoreSearchOptions{
		SearchTerm: searchTerm,
		NumCount:   numCount,
		Language:   lang,
		Country:    country,
	}, nil
}

func optionsToQueryParams(options *PlayStoreSearchOptions) string {
	queryParams := url.Values{
		"searchTerm": {options.SearchTerm},
		"numCount":   {strconv.Itoa(options.NumCount)},
		"lang":       {options.Language},
		"country":    {options.Country},
	}

	return queryParams.Encode()
}

func SearchPlayStore(options *PlayStoreSearchOptions) ([]SearchResult, error) {
	if options == nil {
		return nil, errors.New("failed to perform search on app store - unknown error")
	}

	playStoreSearchURL := fmt.Sprintf("%s/search?%s", config.C.PlayStoreAPIUrl, optionsToQueryParams(options))

	req, err := http.NewRequest(http.MethodGet, playStoreSearchURL, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %v", err)
	}

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
		Results []PlayStoreAppData `json:"results"`
	}

	err = json.Unmarshal(body, &parsedResponse)
	if err != nil {
		return nil, fmt.Errorf("failed to parse response: %v", err)
	}

	if len(parsedResponse.Results) == 0 {
		return nil, fmt.Errorf("no results found for search term: %s", options.SearchTerm)
	}

	return utils.Map(parsedResponse.Results, convertPlayStoreAppDataToSearchResult), nil
}

func convertPlayStoreAppDataToSearchResult(data PlayStoreAppData) SearchResult {
	return SearchResult{
		Name:          data.Name,
		BundleID:      data.BundleID,
		DeveloperName: data.DeveloperName,
		Rating:        data.Rating,
		IconURL:       data.IconURL,
		Description:   data.Description,
	}
}
