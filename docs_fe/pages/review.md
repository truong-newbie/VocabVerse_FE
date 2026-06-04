# frontend/docs/pages/review.md

# REVIEW TODAY PAGE

## Route

```text
/review
```

---

# Mục tiêu

Hiển thị các collection cần ôn tập theo Spaced Repetition.

---

# Layout

```text
--------------------------------

Review Summary

--------------------------------

Due Collections

--------------------------------

Review History

--------------------------------
```

---

# Review Summary

Hiển thị:

```text
Collections Due

Words Due

Current Streak
```

---

# Due Collections

Mỗi item:

```text
Collection Name

Words Due

Review Button
```

Ví dụ:

```text
TOEIC 600 Words

25 Words

[Review]
```

---

# Review History

Columns:

```text
Date

Collection

Status
```

---

Status:

```text
Completed

Missed

Skipped
```

---

# Empty State

```text
No reviews due today.
```

---

Button:

```text
Explore Collections
```

---

# API

```text
GET /reviews/today

POST /reviews/sessions/{id}/complete
```

---

END OF DOCUMENT
