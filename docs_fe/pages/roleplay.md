# frontend/docs/pages/roleplay.md

# ROLEPLAY PAGE

## Route

```text
/roleplay
```

---

# Mục tiêu

Luyện giao tiếp tiếng Anh với AI.

---

# Layout

Desktop:

```text
------------------------------------------------

Scenario Panel

Chat Panel

Correction Panel

------------------------------------------------
```

---

Mobile:

```text
Scenario

↓

Chat

↓

Correction
```

---

# Create Session

Fields:

---

## Topic

Options:

```text
Restaurant

Hotel

Airport

Interview

Shopping

Business Meeting
```

---

## Difficulty

Options:

```text
Easy

Medium

Hard
```

---

## Persona

Options:

```text
Friendly Waiter

Strict Interviewer

Airport Officer

Receptionist

Customer
```

---

# Start Button

```text
Start Roleplay
```

---

# Scenario Panel

Hiển thị:

```text
Topic

Difficulty

Persona

Scenario Description
```

---

# Chat Panel

Messages:

```text
User

AI
```

---

Input:

```text
Type your message...
```

---

Send Button

---

# Message Bubble

User:

```text
Right Align
```

AI:

```text
Left Align
```

---

# Correction Panel

Hiển thị:

```text
Original Sentence

Corrected Sentence

Explanation

Better Expression
```

---

Ví dụ:

Original:

```text
I want eat pizza
```

Corrected:

```text
I want to eat pizza
```

Explanation:

```text
Sau want phải dùng to + verb.
```

---

# Session Report

Sau khi kết thúc.

---

Sections:

```text
Fluency Score

Grammar Score

Vocabulary Score

Mistakes

Recommendations
```

---

# Actions

```text
Download Report

Start New Session
```

---

# Loading State

Trong lúc AI trả lời:

```text
Typing Indicator
```

---

# Error State

```text
AI is temporarily unavailable.
```

Button:

```text
Try Again
```

---

# API

```text
POST /roleplay/sessions

POST /roleplay/sessions/{id}/messages

POST /roleplay/sessions/{id}/end

GET /roleplay/sessions/{id}/report
```

---

# Permissions

Authenticated User

---

END OF DOCUMENT
