package lib

type SearchOptions struct {
	SearchTerm string
	NumCount   int
	Country    CountryCode
	Language   string
}

type AppData struct {
	TrackID           int64   `json:"trackId"`
	TrackName         string  `json:"trackName"`
	BundleID          string  `json:"bundleId"`
	ArtistName        string  `json:"artistName"`
	Version           string  `json:"version"`
	AverageUserRating float64 `json:"averageUserRating"`
	ArtworkURL100     string  `json:"artworkUrl100"`
	Description       string  `json:"description"`
	Country           string  `json:"country"`
}

type AppStoreSearchResult struct {
	ID            int64   `json:"id,omitempty"`
	Name          string  `json:"name,omitempty"`
	BundleID      string  `json:"bundleId,omitempty"`
	DeveloperName string  `json:"developerName,omitempty"`
	Version       string  `json:"version,omitempty"`
	Rating        float64 `json:"averageRating,omitempty"`
	IconURL       string  `json:"iconUrl,omitempty"`
	Description   string  `json:"description,omitempty"`
	Country       string  `json:"country,omitempty"`
}
