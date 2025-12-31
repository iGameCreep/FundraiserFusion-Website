# V1 of StreamTrigger's API.

Subject to change until a proper version of the plugin is released.

## Routes

### `GET /events/:id`

#### Parameters

-   `b64`: Boolean. Whether the data should be returned as Base64 or as JSON (default).
-   `:id`: The contents of the event file in the chosen format (default: JSON).

#### Returns:

-   200 OK: The contents of the event file in desired format.
-   404 Not Found: If the ID wasn't found in the database.

### `POST /events/generate`

#### Parameters

-   `data`: Base64 string of the contents of the event file.

#### Returns

-   200 OK: Returns the ID and the URL associated with said events file.
