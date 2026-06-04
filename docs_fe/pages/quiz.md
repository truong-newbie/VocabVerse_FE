# frontend/docs/pages/quiz.md

# QUIZ PAGE

## Route

```text
/collections/:id/quiz
```

---

# Mục tiêu

Kiểm tra khả năng ghi nhớ từ vựng.

---

# Quiz Types

```text
Multiple Choice

Fill In Blank

Meaning Match

Mixed
```

---

# Start Screen

Fields:

```text
Quiz Type

Question Count
```

---

Question Count:

```text
10

20

50
```

---

# Quiz Layout

```text
--------------------------------

Progress

--------------------------------

Question

--------------------------------

Options

--------------------------------
```

---

# Question

Ví dụ:

```text
What does "abandon" mean?
```

---

# Options

```text
A. từ bỏ

B. xây dựng

C. tiếp tục

D. mua
```

---

# Navigation

Buttons:

```text
Previous

Next

Submit
```

---

# Result Screen

Hiển thị:

```text
Score

Correct Answers

Wrong Answers

Accuracy
```

---

# Review Answers

Hiển thị:

```text
Question

Your Answer

Correct Answer
```

---

# API

```text
POST /learning/quizzes/start

POST /learning/quizzes/{id}/submit
```

---

END OF DOCUMENT
