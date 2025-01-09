package utils_test

import (
	"reflect"
	"testing"

	"github.com/tramlinehq/store-sweeper/utils"
)

func testMapFn(item interface{}) interface{} {
	if reflect.TypeOf(item).Kind() == reflect.String {
		return item.(string) + "!"
	}
	if reflect.TypeOf(item).Kind() == reflect.Int64 {
		return item.(int64) + 1
	}
	if reflect.TypeOf(item).Kind() == reflect.Float64 {
		return item.(float64) + 1.5
	}
	return item
}

func TestMap(t *testing.T) {
	type args struct {
		list  []interface{}
		mapFn func(interface{}) interface{}
	}

	tests := []struct {
		name string
		args args
		want []interface{}
	}{
		{
			name: "Test Map with string",
			args: args{
				list:  []interface{}{"a", "b", "c"},
				mapFn: testMapFn,
			},
			want: []interface{}{"a!", "b!", "c!"},
		},
		{
			name: "Test Map with int64",
			args: args{
				list:  []interface{}{int64(1), int64(2), int64(3)},
				mapFn: testMapFn,
			},
			want: []interface{}{int64(2), int64(3), int64(4)},
		},
		{
			name: "Test Map with float64",
			args: args{
				list:  []interface{}{float64(1.1), float64(2.2), float64(3.3)},
				mapFn: testMapFn,
			},
			want: []interface{}{float64(2.6), float64(3.7), float64(4.8)},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := utils.Map(tt.args.list, tt.args.mapFn); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("Map() = %v, want %v", got, tt.want)
			}
		})
	}
}
