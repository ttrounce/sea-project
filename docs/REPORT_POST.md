# API - report.js

## Request

Requires the post id, `<post id>`, of a post, and the username, `<username>`, of the reporter of the post.

```json
POST /api/posts/report HTTP/1.1
content-type: application/json

{
"post_id": "<post id>",
"username": "<username>"
}
```

---

## Response

- `200`: Successfully reports a post

  ```json
  {
      "message": "Successfully reported post"
  }
  ```

- `404`: Validation Error causes post to not be found, due to missing `<post id>`.

  ```json
  {
      "message": "<content> missing"
  }
  ```

- `500`: Unknown server error

  ```json
  {
      "message": "Error reporting post"
  }
  ```

---
