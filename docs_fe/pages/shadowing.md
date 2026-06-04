# frontend/docs/pages/shadowing.md

# SHADOWING PAGE

## Route

```text
/shadowing
```

## Detail Route

```text
/shadowing/:videoId
```

---

# Mục tiêu

Giúp người dùng luyện nghe, luyện phát âm và bắt chước ngữ điệu tiếng Anh thông qua video có song ngữ Anh - Việt.

---

# User Flow

```text
User mở Shadowing Library

↓

Chọn video

↓

Xem video + subtitle song ngữ

↓

Replay từng câu

↓

Nhại lại câu

↓

Đánh dấu hoàn thành
```

---

# Shadowing Library Layout

```text
--------------------------------

Page Header

--------------------------------

Search + Difficulty Filter

--------------------------------

Video Grid

--------------------------------
```

---

# Page Header

Title:

```text
Shadowing
```

Description:

```text
Practice listening and speaking with real English videos.
```

---

# Filters

Difficulty:

```text
All

Easy

Medium

Hard
```

Status:

```text
All

Not Started

In Progress

Completed
```

---

# Video Card

Mỗi video card hiển thị:

```text
Thumbnail

Title

Description

Difficulty

Duration

Progress
```

Actions:

```text
Start Practice

Continue
```

---

# Empty State

Title:

```text
No shadowing videos available
```

Description:

```text
Please check again later.
```

---

# Video Detail Layout

Desktop:

```text
------------------------------------------------

Video Player

------------------------------------------------

Current Subtitle

------------------------------------------------

Subtitle List / Transcript

------------------------------------------------

Practice Controls

------------------------------------------------
```

---

# Video Player

Yêu cầu:

```text
Play

Pause

Seek

Replay Current Line
```

---

# Current Subtitle

Hiển thị nổi bật câu hiện tại:

English:

```text
What would you like to order today?
```

Vietnamese:

```text
Bạn muốn gọi món gì hôm nay?
```

---

# Transcript List

Mỗi dòng subtitle:

```text
Time

English Text

Vietnamese Text
```

Khi video chạy đến câu nào thì highlight câu đó.

---

# Practice Controls

Buttons:

```text
Replay Sentence

Mark As Practiced

Next Sentence
```

---

# V2 Feature

Ghi âm người dùng.

Flow:

```text
User record voice

↓

Speech-to-text

↓

Compare with original sentence

↓

Show pronunciation score
```

---

# Loading State

Khi video đang xử lý:

```text
Video is being processed.
```

Status:

```text
PROCESSING
```

---

# Error State

Nếu video xử lý lỗi:

```text
This video is temporarily unavailable.
```

---

# API

```text
GET /api/v1/shadowing/videos

GET /api/v1/shadowing/videos/{videoId}

POST /api/v1/shadowing/videos/{videoId}/progress
```

Admin API:

```text
POST /api/v1/admin/shadowing/videos
```

---

# Permissions

User:

```text
View shadowing videos

Practice shadowing
```

Admin:

```text
Upload videos
```

---

# UI Rules

Không làm UI quá giống YouTube.

Mục tiêu không phải xem video giải trí, mà là học tập.

Ưu tiên:

```text
Subtitle rõ

Replay dễ

Progress rõ

Không phân tâm
```

---

END OF DOCUMENT
