# API - get_profile.js

---

## Request

```json
POST /api/get_profile HTTP/1.1
content-type: application/json

{
    "userid": "exampleid"
}
```

---

## Response

- `200`: Successful Retrieval of User details

    ```json
    {
        "username": "exampleusername",
        "firstname": "examplefname",
        "surname": "examplesname",
        "email": "example@email.com",
        "noofpoints": "integer",
        "rolename": "examplerole",
        "noofposts": "integer"
    }
    ```

- `404`: Invalid user ID supplied

    ```json
    {
        "message": "Could not find requested user"
    }
    ```

- `500`: Server or Database Error

    ```json
    {
        "message": "Unknown server error, please contact an administrator"
    }
    ```
