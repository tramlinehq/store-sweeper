package lib

type AppStoreSearchOptions struct {
	SearchTerm string
	NumCount   int
	Country    CountryCode
	Language   string
}

type PlayStoreSearchOptions struct {
	SearchTerm string
	NumCount   int
	Language   string
	Country    string
}

type AppStoreAppData struct {
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

type SearchResult struct {
	ID            int64   `json:"id,omitempty"`
	Name          string  `json:"name,omitempty"`
	BundleID      string  `json:"bundleId,omitempty"`
	DeveloperName string  `json:"developerName,omitempty"`
	Version       string  `json:"version,omitempty"`
	Rating        float64 `json:"averageRating,omitempty"`
	IconURL       string  `json:"iconUrl,omitempty"`
	Description   string  `json:"description,omitempty"`
	Country       string  `json:"country,omitempty"`
	AppURL        string  `json:"appUrl,omitempty"`
}

type PlayStoreAppData struct {
	Name          string  `json:"title,omitempty"`
	BundleID      string  `json:"appId,omitempty"`
	DeveloperName string  `json:"developer,omitempty"`
	Rating        float64 `json:"score,omitempty"`
	IconURL       string  `json:"icon,omitempty"`
	Description   string  `json:"summary,omitempty"`
}
