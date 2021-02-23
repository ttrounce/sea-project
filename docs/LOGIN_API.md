## API - login.js
---
### Request:

```json
POST /api/login HTTP/1.1
content-type: application/json

{
    "username": "examplename",
    "pass": "examplepassword"
}
```


### Response:
- `200`: Successful Login 
    ```json
    {
        "message": "Successfully logged in" 
    }
    ```
- `401`: Incorrect username or password
    ```json
    {
        "message": "Incorrect username or password"
    }
    ```
- `422`: Invalid username or password semantics (eg: wrong length or empty)
    ```json
    {
        "type": "validation", // the type of 422
        "field": "username"   // the field that caused the 422 
    }
    ```
- `500`: Server or database error
    ```json
    {
        "message": "Unknown server error, please contact an administrator"
    }
    ```