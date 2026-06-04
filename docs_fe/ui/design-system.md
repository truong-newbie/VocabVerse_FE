# frontend/docs/ui/design-system.md

# VOCABVERSE DESIGN SYSTEM

## Design Philosophy

VocabVerse là nền tảng học tiếng Anh.

UI cần:

* Sạch
* Hiện đại
* Tập trung học tập
* Giảm phân tâm
* Ưu tiên nội dung

Không thiết kế theo:

```text
Crypto Dashboard

Admin ERP

Trading Platform
```

---

# Design Keywords

```text
Clean

Educational

Modern

Minimal

Focused

Readable
```

---

# Border Radius

Card:

```css
16px
```

Button:

```css
12px
```

Input:

```css
12px
```

Dialog:

```css
20px
```

---

# Shadow

Card:

```css
shadow-sm
```

Hover:

```css
shadow-md
```

Không dùng shadow quá nặng.

---

# Typography

Font:

```text
Inter
```

Fallback:

```text
sans-serif
```

---

# Font Scale

H1

```css
text-4xl
font-bold
```

---

H2

```css
text-3xl
font-semibold
```

---

H3

```css
text-2xl
font-semibold
```

---

Body

```css
text-base
```

---

Small

```css
text-sm
```

---

# Layout

Content Width

```css
max-w-7xl
```

---

Form Width

```css
max-w-xl
```

---

Reading Width

```css
max-w-3xl
```

---

# Color System

Primary

```text
Blue
```

Usage:

```text
Primary Button

Active Navigation

Links
```

---

Success

```text
Green
```

Usage:

```text
Correct Answer

Success Message
```

---

Warning

```text
Orange
```

Usage:

```text
Review Due

Warning State
```

---

Danger

```text
Red
```

Usage:

```text
Delete

Error
```

---

# Spacing

Small

```css
gap-2
```

Medium

```css
gap-4
```

Large

```css
gap-6
```

Section

```css
gap-8
```

---

# Card Rules

Every card must contain:

```text
Title

Content

Action
```

Example:

```text
TOEIC 600 Words

600 words

[Learn]
```

---

# Button Rules

Primary

```text
Create Collection

Start Quiz

Save
```

---

Secondary

```text
Cancel

Back
```

---

Danger

```text
Delete Collection
```

---

# Table Rules

Use for:

```text
Vocabulary List

Users

Review Sessions
```

---

Must support:

```text
Pagination

Search

Sort
```

---

# Loading State

Always show skeleton.

Never show:

```text
Blank Screen
```

---

# Empty State

Must include:

```text
Icon

Message

Action Button
```

Example:

```text
No collections yet

Create your first collection
```

---

# Mobile First

Target:

```text
Mobile

Tablet

Desktop
```

---

# Accessibility

All forms:

```text
Label

Placeholder

Error Message
```

Required.

---

# Dark Mode

Required.

Use:

```text
next-themes style approach
```

Theme:

```text
Light

Dark

System
```

---

# Flashcard Design

Front:

```text
Word
```

Back:

```text
Meaning

Example

Synonyms
```

Large font.

Minimal distractions.

---

# Roleplay Design

Split Layout

```text
Scenario Panel

Chat Panel

Correction Panel
```

Desktop.

---

# Shadowing Design

Video Top

Subtitle Bottom

```text
English

Vietnamese
```

Side by side.

---

END OF DOCUMENT
