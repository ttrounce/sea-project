## API - get_post.js
### Request:
Retrieves a post for editing.
```json
GET /api/posts/get_post HTTP/1.1
content-type: application/json

{
	"post_id": "<post id>"
}
```

---

### Response:
- `200`: Successfully retrieves a post (with a title `<post title>` and content `<post content>`) for editing
	```json
	{
		"posttitle": "<post title>,"
		"postcontent": "<post content>"
	}
	```
- `400`: No post ID passed as a parameter
	```json
	{
		"message": "No post id passed"
	}
	```
- `404`: No post is found for the given `<post id>`
	```json
	{
		"message": "No post found with id <post id>"
	}
	```
---
