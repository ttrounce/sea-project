## API - delete.js
### Request:
Requires the post id, `<post id>`, of the post to delete.
```json
POST /api/posts/delete HTTP/1.1
content-type: application/json

{
	"post_id": "<post id>"
}
```
---
### Response:
- `200`: Successfully deletes a post
	```json
	{
		"message": "Successfully deleted post"
	}
	```
- `400`: Error preventing the deletion of a post, due to the post not existing
	```json
	{
		"message": "Could not delete post"
	}
	```
- `400`: Error preventing deletion of post due to post id, `<post id>`, not being supplied in the request
	```json
	{
		"message": "post id missing"
	}
	```
- `500`: Unknown server error with error code `<error code>`
	```json
	{
		"message": "Server Error: <error code>"
	}
	```
---
