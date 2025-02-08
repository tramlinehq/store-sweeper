package lib

import "strings"

type CountryCode int

// Country codes
// ref: https://github.com/ngo275/app-store-client/blob/dd1c2bc61aebfcf18a83828a8a2904611e675acd/src/constants.ts#L103

// CountryCodes defines a mapping from country codes to their corresponding store IDs
var countryCodes = map[string]CountryCode{
	"DZ": 143563, "AO": 143564, "AI": 143538, "AR": 143505, "AM": 143524,
	"AU": 143460, "AT": 143445, "AZ": 143568, "BH": 143559, "BB": 143541,
	"BY": 143565, "BE": 143446, "BZ": 143555, "BM": 143542, "BO": 143556,
	"BW": 143525, "BR": 143503, "VG": 143543, "BN": 143560, "BG": 143526,
	"CA": 143455, "KY": 143544, "CL": 143483, "CN": 143465, "CO": 143501,
	"CR": 143495, "HR": 143494, "CY": 143557, "CZ": 143489, "DK": 143458,
	"DM": 143545, "EC": 143509, "EG": 143516, "SV": 143506, "EE": 143518,
	"FI": 143447, "FR": 143442, "DE": 143443, "GB": 143444, "GH": 143573,
	"GR": 143448, "GD": 143546, "GT": 143504, "GY": 143553, "HN": 143510,
	"HK": 143463, "HU": 143482, "IS": 143558, "IN": 143467, "ID": 143476,
	"IE": 143449, "IL": 143491, "IT": 143450, "JM": 143511, "JP": 143462,
	"JO": 143528, "KE": 143529, "KR": 143466, "KW": 143493, "LV": 143519,
	"LB": 143497, "LT": 143520, "LU": 143451, "MO": 143515, "MK": 143530,
	"MG": 143531, "MY": 143473, "ML": 143532, "MT": 143521, "MU": 143533,
	"MX": 143468, "MS": 143547, "NP": 143484, "NL": 143452, "NZ": 143461,
	"NI": 143512, "NE": 143534, "NG": 143561, "NO": 143457, "OM": 143562,
	"PK": 143477, "PA": 143485, "PY": 143513, "PE": 143507, "PH": 143474,
	"PL": 143478, "PT": 143453, "QA": 143498, "RO": 143487, "RU": 143469,
	"SA": 143479, "SN": 143535, "SG": 143464, "SK": 143496, "SI": 143499,
	"ZA": 143472, "ES": 143454, "LK": 143486, "SR": 143554, "SE": 143456,
	"CH": 143459, "TW": 143470, "TZ": 143572, "TH": 143475, "TN": 143536,
	"TR": 143480, "UG": 143537, "UA": 143492, "AE": 143481, "US": 143441,
	"UY": 143514, "UZ": 143566, "VE": 143502, "VN": 143471, "YE": 143571,
}

func GetCountryCode(countryStr string) CountryCode {
	countryStrUpper := strings.ToUpper(countryStr)
	if _, ok := countryCodes[countryStrUpper]; !ok {
		return countryCodes["US"] // Set default country code to US
	}
	return countryCodes[countryStrUpper]
}
