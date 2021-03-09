# API - new.js (Posts)

## Request

```json
POST /api/posts/new HTTP/1.1
content-type: application/json

{
	"content": "<post content>",
	"group": "<group id>",
	"title": "<post title>",
	"user": "<user id>"
}
```

---

## Response

- `200`: Successfully creates new post

	```json
	{
		"message": "Successfully submitted post <post id>"
	}
	```

- `400`: Validation Error - `<content>` changes to the input which is missing or incorrectly formatted.

	```json
	{
		"message": "<content> missing"
	}
	```

- `500`: Server Error - an error with the server or database, changes `<error code>` to whatever error code was thrown.
	```json
	{
		"message": "Postgres error <error code>"
	}
	```
	
---
