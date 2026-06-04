# frontend/docs/pages/flashcard.md

# FLASHCARD PAGE

## Route

```text
/collections/:id/flashcards
```

---

# Mục tiêu

Giúp người dùng ghi nhớ từ vựng theo phương pháp flashcard.

---

# Learning Flow

```text
Word

↓

Guess Meaning

↓

Flip Card

↓

Self Evaluation

↓

Next Card
```

---

# Layout

```text
--------------------------------

Progress Bar

--------------------------------

Flashcard

--------------------------------

Actions

--------------------------------
```

---

# Progress Bar

Hiển thị:

```text
Current Card

Total Cards

Percentage
```

Ví dụ:

```text
15 / 100

15%
```

---

# Flashcard Front

Hiển thị:

```text
Word

Phonetic

Part Of Speech
```

Ví dụ:

```text
abandon

/əˈbændən/

verb
```

---

# Flashcard Back

Hiển thị:

```text
Meaning

Synonyms

Example

Memory Tip
```

---

# Actions

Buttons:

```text
Show Answer
```

Sau khi lật:

```text
Hard

Medium

Easy
```

---

# Keyboard Shortcuts

```text
Space = Flip

1 = Hard

2 = Medium

3 = Easy
```

---

# Session Complete

Hiển thị:

```text
Cards Reviewed

Hard

Medium

Easy
```

---

# API

```text
POST /learning/flashcards/start

POST /learning/flashcards/result
```

---

END OF DOCUMENT
