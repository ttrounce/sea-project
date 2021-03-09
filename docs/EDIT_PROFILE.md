# API - edit.js

## Request

```json
POST /api/posts/edit HTTP/1.1
content-type: application/json

{
    "content": "<post content>",
    "group": "<group id>",
    "post_id": "<post id>",
    "title": "<post title>",
    "user": "<user id>"
}
```

---

## Response

- `200`: Successfully edited a post

    ```json
    {
        "message": "Successfully edited post <post id>"
    }
    ```

- `400`: Validation Error due to missing request fields, `<field>`

    ```json
    {
        "message": "<field> missing"
    }
    ```

- `500`: Unknown Server error, with an error code of `<error code>`

    ```json
    {
        "message": "Postgres error <error code>"
    }
    ```

---
