# API - new.js (Groups)

## Request

Creates a new group with the name `<group name>` and description `<group desc>`.

```json
POST /api/groups/new HTTP/1.1
content-type: application/json

{
	"description": "<group desc>",
	"name": "<group name>"
}
```

---

## Response

- `200`: Successfully creates a new group

	```json
	{
		"message": "Successfully created group",
		"group_id": "<group id>"
	}
	```

- `400`: Validation Error due to a field, `<field>`, being missing from the request

	```json
	{
		"message": "<field> missing"
	}
	```

- `500`: Unknown server error with error code, `<error code>`

	```json
	{
		"message": "Postgres error <error code>"
	}
	```

---
