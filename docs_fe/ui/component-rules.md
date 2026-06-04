# frontend/docs/ui/component-rules.md

# COMPONENT RULES

## Project

VocabVerse Frontend

---

# Mục tiêu

Tạo hệ thống component:

* Reusable
* Predictable
* Consistent
* Dễ maintain

---

# Golden Rules

Trước khi tạo component mới:

Hỏi:

```text
Component này đã tồn tại chưa?
```

Nếu có:

```text
Reuse
```

Không tạo component mới.

---

# Component Hierarchy

## Level 1

UI Components

Ví dụ:

```text
Button

Input

Textarea

Badge

Dialog

DropdownMenu
```

Nguồn:

```text
shadcn/ui
```

---

## Level 2

Shared Components

Ví dụ:

```text
PageHeader

DataTable

SearchInput

ConfirmDialog

LoadingSpinner

EmptyState
```

---

## Level 3

Feature Components

Ví dụ:

```text
CollectionCard

VocabularyTable

FlashcardView

RoleplayChat

ShadowingPlayer
```

---

# Folder Structure

```text
components

├── ui
├── common
├── layout
├── charts
└── forms
```

---

# Naming Convention

## Component

PascalCase

Ví dụ:

```text
CollectionCard.tsx

VocabularyTable.tsx

RoleplayChat.tsx
```

---

## Hook

```text
useCollections.ts

useRoleplay.ts
```

---

## Types

```text
Collection.ts

Vocabulary.ts
```

---

# Common Components

Bắt buộc dùng lại.

---

## PageHeader

Dùng cho:

```text
Dashboard

Collections

Roleplay

Shadowing
```

Props:

```ts
title

description

actions
```

---

## EmptyState

Dùng khi không có dữ liệu.

Không tự tạo UI riêng.

Props:

```ts
icon

title

description

action
```

---

## LoadingSpinner

Dùng loading nhỏ.

---

## LoadingSkeleton

Dùng loading page.

---

## ConfirmDialog

Dùng cho:

```text
Delete Collection

Delete Vocabulary

Delete Video
```

---

# Layout Components

## AppLayout

```text
Sidebar

Header

Content
```

---

## AppSidebar

Navigation chính.

---

## AppHeader

Top Header.

---

# Form Components

## FormInput

Dùng cho:

```text
Text

Email

Password
```

---

## FormTextarea

---

## FormSelect

---

## FormCheckbox

---

## FormField

Wrapper chung.

---

# Table Components

## DataTable

Dùng cho:

```text
Vocabulary

Collections

Users

Reviews
```

Bắt buộc hỗ trợ:

```text
Pagination

Search

Sort
```

---

# Card Components

## CollectionCard

Hiển thị:

```text
Title

Description

Word Count

Actions
```

---

## StatisticCard

Hiển thị:

```text
Value

Label

Icon
```

Ví dụ:

```text
320

Words Learned
```

---

# Dashboard Components

## DashboardStats

Grid statistics.

---

## LearningActivityChart

Chart học tập.

---

## RecentCollections

Danh sách collection gần đây.

---

# Collection Components

## CollectionCard

---

## CollectionGrid

---

## CollectionDetailHeader

---

## VocabularyTable

---

# Flashcard Components

## FlashcardView

Hiển thị:

```text
Word

Meaning

Examples

Synonyms
```

---

## FlashcardControls

```text
Hard

Medium

Easy
```

---

# Quiz Components

## QuizQuestion

---

## QuizOptions

---

## QuizResult

---

# Review Components

## ReviewCalendar

---

## ReviewSessionCard

---

# Shadowing Components

## ShadowingPlayer

Video Player.

---

## SubtitlePanel

Hiển thị:

```text
English

Vietnamese
```

---

## RepeatButton

Replay current sentence.

---

# Roleplay Components

## ScenarioCard

Hiển thị:

```text
Topic

Difficulty

Persona
```

---

## RoleplayChat

Chat window.

---

## MessageBubble

User hoặc AI.

---

## CorrectionPanel

Hiển thị:

```text
Original

Corrected

Explanation
```

---

# API Components Rule

Component không được:

```text
axios.get()

fetch()

mutation()
```

trực tiếp.

---

Đúng:

```text
Component

↓

Custom Hook

↓

Service

↓

API
```

---

# State Rules

Component local state:

```text
useState
```

---

Server state:

```text
React Query
```

---

Global UI state:

```text
Zustand
```

---

# Forbidden

Không tạo:

```text
HelperComponent

UniversalCard

MagicTable

CommonWidget

GlobalContainer
```

Tên không rõ mục đích.

---

# Responsive Rules

Mọi component phải hỗ trợ:

```text
Mobile

Tablet

Desktop
```

---

# Accessibility

Button:

```text
aria-label
```

Form:

```text
label
```

Dialog:

```text
keyboard navigation
```

---

# Before Creating New Component

Ask:

```text
1. Does a similar component already exist?

2. Can I extend existing component?

3. Is this reusable?

4. Does naming clearly describe purpose?
```

Nếu câu trả lời là:

```text
Reuse existing component
```

thì không tạo component mới.

---

END OF DOCUMENT
