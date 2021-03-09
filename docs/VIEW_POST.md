# API - view.js

## Request

Requires the post id, `<post id>`, of a post, the timestamp, `<timestanp>`, of a post and the username, `<username>`, of the author of the post.

```json
POST /api/posts/view HTTP/1.1
content-type: application/json

{
	"post_id": "<post id>",
	"timestamp": "<timestamp>",
	"username": "<username>"
}
```

---

## Response

- `200`: Successfully gets the view of a post

	```json
	{
		"message": "Successfully viewed post"
	}
	```

- `404`: Validation Error causes post to not be found, due to missing `<post id>` or `<timestamp>` in request. `<content>` changes based on what is missing

	```json
	{
		"message": "<content> missing"
	}
	```

- `500`: Unknown server error

	```json
	{
		"message": "Error inserting post view"
	}
	```

---
