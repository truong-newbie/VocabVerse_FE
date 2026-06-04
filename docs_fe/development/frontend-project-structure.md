# frontend/docs/development/frontend-project-structure.md

# FRONTEND PROJECT STRUCTURE

## Project

VocabVerse Frontend

---

# Tech Stack

Core:

* React 19
* TypeScript
* Vite

Styling:

* TailwindCSS
* shadcn/ui

Data Fetching:

* TanStack Query

Forms:

* React Hook Form
* Zod

Routing:

* React Router

Charts:

* Recharts

State Management:

* Zustand

---

# Project Structure

```text
src

├── app
│   ├── router
│   ├── providers
│   └── store
│
├── pages
│   ├── auth
│   ├── dashboard
│   ├── collections
│   ├── vocabulary
│   ├── flashcard
│   ├── quiz
│   ├── typing
│   ├── review
│   ├── shadowing
│   ├── roleplay
│   └── admin
│
├── features
│   ├── auth
│   ├── collection
│   ├── vocabulary
│   ├── flashcard
│   ├── quiz
│   ├── review
│   ├── shadowing
│   └── roleplay
│
├── components
│   ├── common
│   ├── layout
│   ├── forms
│   ├── tables
│   ├── charts
│   └── ui
│
├── services
│
├── hooks
│
├── types
│
├── constants
│
├── utils
│
├── assets
│
└── styles
```

---

# Folder Responsibilities

## pages

Chứa page-level component.

Ví dụ:

```text
pages/dashboard/DashboardPage.tsx

pages/collections/CollectionDetailPage.tsx

pages/roleplay/RoleplayPage.tsx
```

---

## features

Business logic UI.

Ví dụ:

```text
features/collection

features/vocabulary

features/review
```

Mỗi feature có thể chứa:

```text
components

hooks

services

types
```

---

## components

Component dùng chung.

Ví dụ:

```text
AppSidebar

AppHeader

DataTable

ConfirmDialog

LoadingSpinner
```

---

## services

Chứa API client.

Ví dụ:

```text
auth.service.ts

collection.service.ts

vocabulary.service.ts
```

Không gọi axios trực tiếp trong page.

---

# State Management

## React Query

Dùng cho:

```text
Collections

Vocabulary

Dashboard

Review Sessions

Roleplay History
```

---

## Zustand

Dùng cho:

```text
Auth State

Theme

Global UI State
```

---

# Naming Convention

## Component

```text
CollectionCard.tsx

VocabularyTable.tsx

FlashcardView.tsx
```

---

## Page

```text
CollectionListPage.tsx

CollectionDetailPage.tsx

DashboardPage.tsx
```

---

## Hook

```text
useCollections.ts

useVocabularySearch.ts

useRoleplay.ts
```

---

## Service

```text
collection.service.ts

roleplay.service.ts
```

---

# Forbidden

Không được:

```text
axios trong component

business logic trong page

api call trong ui component

global state cho dữ liệu server
```

---

# Recommended Flow

```text
Page
 ↓
Feature Hook
 ↓
Service
 ↓
API
```

END OF DOCUMENT
