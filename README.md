## API

- login/signup : /api/v1/user (POST)

  - Body : {phone_number, priority(optional)}

- Create task : /api/v1/task (POST)

  - Body : {title, description, due_date}

- Create subtask : /api/v1/subtask/:task_id (POST)

- Get task : /api/v1/task (GET)

  - Body : {due_date, status, priority, page, limit} (all optional)

- Get subtask : /api/v1/subtask (GET)

  - Body : {task_id} (optional)

- Update task : /api/v1/task/:taskId (PUT)

  - Body : {due_date, status} (optional)

- Update subtask : /api/v1/subtask/:subtaskId (PUT)

  - Body : {status}

- Delete task : /api/v1/task/:taskId (DELETE)

- Delete subtask : /api/v1/subtask/:subtaskId (DELETE)
