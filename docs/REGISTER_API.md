## API - register.js
---
### Request:

```json
POST /api/register HTTP/1.1
content-type: application/json

{
    "username": "example_name",
    "email": "name@example.com",
    "firstname": "example_firstname",
    "lastname": "example_lastname",
    "pass": "example_password"
}
```

### Response:
- `200`: Successful Register 
    ```json
    {
        "message": "Successfully registered" 
    }
    ```
- `422`: Invalid input field semantics (eg: wrong length or empty)
    ```json
    {
        "type": "validation", // the type of 422
        "field": "username"   // the field that caused the 422 
    }
    ```
    ```json
    {
        "type": "preexisting", // can also be 'preexisting'
        "field": "email"
    }
    ```
- `500`: Server or database error
    ```json
    {
        "message": "Unknown server error, please contact an administrator"
    }
    ```