# frontend/docs/ui/color-system.md

# COLOR SYSTEM

## Project

VocabVerse Frontend

---

# Mục tiêu

Đảm bảo toàn bộ UI dùng màu sắc thống nhất, dễ maintain và hỗ trợ dark mode.

---

# Design Direction

VocabVerse là sản phẩm học tập.

Màu sắc cần tạo cảm giác:

```text
Tin cậy

Tập trung

Hiện đại

Nhẹ nhàng

Có động lực học
```

Không dùng màu quá gắt hoặc quá nhiều màu.

---

# Primary Color

Primary dùng cho:

```text
Primary Button

Active Navigation

Links

Focus Ring

Important CTA
```

Semantic name:

```text
primary
```

Gợi ý tone:

```text
Blue / Indigo
```

---

# Secondary Color

Dùng cho:

```text
Secondary Button

Subtle Background

Inactive State
```

Semantic name:

```text
secondary
```

---

# Success Color

Dùng cho:

```text
Correct Answer

Completed Review

Success Toast

Mastered Vocabulary
```

Semantic name:

```text
success
```

Gợi ý tone:

```text
Green
```

---

# Warning Color

Dùng cho:

```text
Review Due

Hard Vocabulary

Pending Job

Low Accuracy Warning
```

Semantic name:

```text
warning
```

Gợi ý tone:

```text
Amber / Orange
```

---

# Danger Color

Dùng cho:

```text
Delete

Error

Wrong Answer

Failed Job
```

Semantic name:

```text
destructive
```

Gợi ý tone:

```text
Red
```

---

# Neutral Colors

Dùng cho:

```text
Background

Card

Border

Text

Muted Text
```

Semantic tokens:

```text
background

foreground

card

card-foreground

muted

muted-foreground

border

input
```

---

# Tailwind Token Rule

Không hardcode màu kiểu:

```tsx
className="text-blue-500"
```

Ưu tiên semantic token:

```tsx
className="text-primary"
```

Không dùng:

```tsx
bg-red-500
```

nếu đó là lỗi hệ thống.

Dùng:

```tsx
bg-destructive
```

---

# Status Colors

## Flashcard

```text
Hard = warning

Medium = primary

Easy = success
```

---

## Quiz

```text
Correct = success

Wrong = destructive

Skipped = muted
```

---

## Review

```text
Due Today = warning

Completed = success

Missed = destructive

Upcoming = muted
```

---

## AI Job

```text
Processing = warning

Completed = success

Failed = destructive
```

---

# Dark Mode

Dark mode bắt buộc hỗ trợ.

Không hardcode màu nền trắng:

Sai:

```tsx
className="bg-white text-black"
```

Đúng:

```tsx
className="bg-background text-foreground"
```

---

# Contrast Rule

Text phải dễ đọc.

Không dùng text quá nhạt cho nội dung chính.

Nội dung chính:

```text
foreground
```

Nội dung phụ:

```text
muted-foreground
```

---

# Chart Colors

Chart không nên dùng quá nhiều màu.

Ưu tiên:

```text
Primary

Success

Warning

Muted
```

---

# Button Color Rules

Primary Button:

```text
bg-primary

text-primary-foreground
```

Secondary Button:

```text
variant="secondary"
```

Danger Button:

```text
variant="destructive"
```

---

# Badge Color Rules

Visibility:

```text
PRIVATE = secondary

PUBLIC = success

SYSTEM = primary
```

Difficulty:

```text
EASY = success

MEDIUM = warning

HARD = destructive
```

---

# Accessibility

Màu không được là tín hiệu duy nhất.

Sai:

```text
Chỉ tô đỏ khi sai
```

Đúng:

```text
Tô đỏ + hiển thị text "Wrong"
```

---

END OF DOCUMENT
