# frontend/docs/pages/collections.md

# COLLECTIONS PAGE

## Route

```text
/collections
```

---

# Mục tiêu

Quản lý toàn bộ collection của user.

---

# Layout

```text
------------------------------------------------

Header

------------------------------------------------

Search + Filter

------------------------------------------------

Collection Grid

------------------------------------------------

Pagination

------------------------------------------------
```

---

# Header

Title:

```text
My Collections
```

Button:

```text
Create Collection
```

---

# Search

Placeholder:

```text
Search collections...
```

---

# Filters

Visibility:

```text
All

Private

Public

System
```

---

# Collection Card

Hiển thị:

```text
Title

Description

Word Count

Visibility

Last Updated
```

---

# Actions

```text
Open

Edit

Delete
```

---

# Create Collection Modal

Fields:

```text
Title

Description

Visibility
```

---

Validation

Title:

```text
Required

Max 150 characters
```

---

# Collection Detail

Route:

```text
/collections/:id
```

---

# Detail Layout

```text
------------------------------------------------

Collection Header

------------------------------------------------

Actions

------------------------------------------------

Vocabulary Table

------------------------------------------------

Statistics

------------------------------------------------
```

---

# Collection Header

Hiển thị:

```text
Title

Description

Visibility

Total Words
```

---

# Learning Actions

Buttons:

```text
Learn Flashcards

Start Quiz

Typing Practice

Enable Review

Export PDF
```

---

# Vocabulary Table

Columns:

```text
Word

Meaning

Part Of Speech

Actions
```

---

Actions:

```text
Edit

Remove
```

---

# Import Vocabulary

Button:

```text
Import Vocabulary
```

---

Modal:

```text
Paste Text

Upload JSON

Upload CSV
```

---

# AI Normalize

Flow:

```text
Input

↓

AI Import

↓

Preview

↓

Confirm

↓

Save
```

---

# Empty State

```text
No vocabulary yet.
```

Button:

```text
Import Vocabulary
```

---

# API

```text
GET /collections

POST /collections

PUT /collections/{id}

DELETE /collections/{id}

GET /collections/{id}
```

---

# Permissions

Owner only for:

```text
Edit

Delete
```

---

END OF DOCUMENT
