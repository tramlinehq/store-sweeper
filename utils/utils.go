package utils

func Map[T any, U any](list []T, mapFn func(T) U) []U {
	result := make([]U, len(list))
	for i, item := range list {
		result[i] = mapFn(item)
	}
	return result
}
