package config

func GetSearchTodoStatus() map[string]string {
	return map[string]string{
		"all":         "1",
		"completed":   "2",
		"uncompleted": "3",
	}
}
