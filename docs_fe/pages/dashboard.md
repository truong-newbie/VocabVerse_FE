# frontend/docs/pages/dashboard.md

# DASHBOARD PAGE

## Route

```text
/dashboard
```

---

# Mục tiêu

Dashboard là màn hình đầu tiên sau khi đăng nhập.

Giúp user biết:

* Hôm nay cần học gì
* Tiến độ học tập
* Streak hiện tại
* Các collection gần đây

---

# Layout

```text
------------------------------------------------

Page Header

------------------------------------------------

Stats Cards

------------------------------------------------

Review Today

------------------------------------------------

Learning Activity Chart

------------------------------------------------

Recent Collections

------------------------------------------------
```

---

# Page Header

Title:

```text
Dashboard
```

Description:

```text
Track your learning progress and stay consistent.
```

---

# Statistics Section

Hiển thị 4 card.

---

## Card 1

Label:

```text
Words Learned
```

Value:

```text
320
```

---

## Card 2

Label:

```text
Review Due Today
```

Value:

```text
25
```

---

## Card 3

Label:

```text
Current Streak
```

Value:

```text
12 days
```

---

## Card 4

Label:

```text
Quiz Accuracy
```

Value:

```text
82%
```

---

# Review Today Section

Hiển thị các collection cần review.

---

Mỗi card:

```text
Collection Name

Words Due

Review Button
```

---

# Learning Activity Chart

Chart:

```text
Last 30 Days
```

Data:

```text
Date

Words Learned
```

---

# Recent Collections

Hiển thị:

```text
5 collections gần nhất
```

---

Mỗi item:

```text
Title

Word Count

Last Studied

Open Button
```

---

# Empty State

Nếu user chưa học gì:

Title:

```text
Start your first collection
```

Button:

```text
Create Collection
```

---

# Loading State

Dùng:

```text
Skeleton
```

Không dùng spinner cho toàn trang.

---

# API

```text
GET /api/v1/dashboard/summary
```

---

# Permissions

```text
Authenticated User
```

---

END OF DOCUMENT
