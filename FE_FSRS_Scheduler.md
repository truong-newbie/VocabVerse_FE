# FE Guide: FSRS Review Scheduler

## 1. Mục tiêu

Backend hiện hỗ trợ 3 scheduler mode cho collection review setting:

- `FIXED_INTERVAL`
- `SM2`
- `FSRS`

FE cần cập nhật giao diện để user có thể chọn `FSRS` và cấu hình thêm:

- `fsrsDesiredRetention`
- `fsrsMaxIntervalDays`

FE không tự tính lịch ôn. Backend sẽ tự tính:

- `fsrsDifficulty`
- `fsrsStability`
- `fsrsRetrievability`
- `nextReviewAt`

## 2. User Flow

Flow chính:

```text
User mở Collection Detail
-> mở Review Settings
-> chọn Review algorithm = FSRS
-> chỉnh Desired retention nếu muốn
-> chỉnh Max interval nếu muốn
-> Save
-> backend lưu setting
-> từ lần review tiếp theo, backend dùng FSRS để tính nextReviewAt
```

Flow review không đổi:

```text
User vào Review Today
-> bấm AGAIN / HARD / GOOD / EASY
-> FE gửi POST /reviews/{vocabularyId}
-> backend tự tính lịch ôn tiếp theo theo scheduler mode của collection
```

## 3. API Contract

Base path:

```text
/api/v1
```

Endpoint liên quan:

```text
GET   /collections/{collectionId}/review-setting
PATCH /collections/{collectionId}/review-setting
POST  /collections/{collectionId}/review-setting/reset
GET   /reviews/today
POST  /reviews/{vocabularyId}
```

## 4. GET Review Setting

### Request

```http
GET /api/v1/collections/{collectionId}/review-setting
Authorization: Bearer <accessToken>
```

### Response example

```json
{
  "success": true,
  "data": {
    "id": "8f36f402-7fd8-4b7c-9246-6db2a5dbe0c7",
    "collectionId": "9b51c9af-c7da-4d83-99ad-89f3b4db83ff",
    "enabled": true,
    "emailEnabled": true,
    "schedulerType": "FSRS",
    "intervals": [1, 3, 7, 14, 30],
    "reminderTime": "08:00:00",
    "timezone": "Asia/Ho_Chi_Minh",
    "fsrsDesiredRetention": 0.9,
    "fsrsMaxIntervalDays": 3650,
    "lastResetAt": null,
    "createdAt": "2026-06-14T09:00:00",
    "updatedAt": "2026-06-14T09:05:00"
  }
}
```

## 5. PATCH Review Setting

### Enable FSRS

```http
PATCH /api/v1/collections/{collectionId}/review-setting
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "schedulerType": "FSRS",
  "fsrsDesiredRetention": 0.9,
  "fsrsMaxIntervalDays": 3650
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "8f36f402-7fd8-4b7c-9246-6db2a5dbe0c7",
    "collectionId": "9b51c9af-c7da-4d83-99ad-89f3b4db83ff",
    "enabled": true,
    "emailEnabled": true,
    "schedulerType": "FSRS",
    "intervals": [1, 3, 7, 14, 30],
    "reminderTime": "08:00:00",
    "timezone": "Asia/Ho_Chi_Minh",
    "fsrsDesiredRetention": 0.9,
    "fsrsMaxIntervalDays": 3650,
    "lastResetAt": null,
    "createdAt": "2026-06-14T09:00:00",
    "updatedAt": "2026-06-14T09:10:00"
  }
}
```

## 6. TypeScript Types

```ts
export type ReviewSchedulerType = 'FIXED_INTERVAL' | 'SM2' | 'FSRS';

export interface CollectionReviewSetting {
  id: string;
  collectionId: string;
  enabled: boolean;
  emailEnabled: boolean;
  schedulerType: ReviewSchedulerType;
  intervals: number[];
  reminderTime: string | null;
  timezone: string | null;
  fsrsDesiredRetention: number;
  fsrsMaxIntervalDays: number;
  lastResetAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCollectionReviewSettingRequest {
  enabled?: boolean;
  emailEnabled?: boolean;
  schedulerType?: ReviewSchedulerType;
  intervals?: number[];
  reminderTime?: string | null;
  timezone?: string | null;
  fsrsDesiredRetention?: number;
  fsrsMaxIntervalDays?: number;
}
```

## 7. UI Requirements

### 7.1. Scheduler selector

Hiển thị 3 options:

```text
Review algorithm
[ Fixed interval ] [ SM-2 ] [ FSRS ]
```

Behavior:

- `FIXED_INTERVAL`: hiện interval editor.
- `SM2`: ẩn hoặc disable interval editor.
- `FSRS`: hiện FSRS advanced settings.

### 7.2. FSRS settings

Khi:

```ts
schedulerType === 'FSRS'
```

Hiển thị:

```text
Desired retention
Max interval
```

Suggested controls:

- `Desired retention`: slider hoặc number input.
- `Max interval`: number input.

Recommended UI:

```text
Desired retention
[ slider 70% - 98% ] 90%

Max interval
[ 3650 ] days
```

### 7.3. Copy text

English:

```text
FSRS
Adapts review timing using memory difficulty, stability, and retention.

Desired retention
Higher retention means more frequent reviews.

Max interval
The longest gap allowed between reviews.
```

Tiếng Việt:

```text
FSRS
Tự điều chỉnh lịch ôn dựa trên độ khó, độ bền trí nhớ và mục tiêu ghi nhớ.

Mức ghi nhớ mong muốn
Mức càng cao thì lịch ôn càng dày.

Khoảng cách ôn tối đa
Số ngày tối đa giữa hai lần ôn.
```

## 8. Form State

Default FE state:

```ts
const DEFAULT_INTERVALS = [1, 3, 7, 14, 30];
const DEFAULT_FSRS_DESIRED_RETENTION = 0.9;
const DEFAULT_FSRS_MAX_INTERVAL_DAYS = 3650;

const defaultForm = {
  enabled: true,
  emailEnabled: true,
  schedulerType: 'FIXED_INTERVAL' as ReviewSchedulerType,
  intervals: DEFAULT_INTERVALS,
  reminderTime: '08:00:00',
  timezone: 'Asia/Ho_Chi_Minh',
  fsrsDesiredRetention: DEFAULT_FSRS_DESIRED_RETENTION,
  fsrsMaxIntervalDays: DEFAULT_FSRS_MAX_INTERVAL_DAYS,
};
```

When loading API:

```ts
setForm({
  enabled: setting.enabled,
  emailEnabled: setting.emailEnabled,
  schedulerType: setting.schedulerType ?? 'FIXED_INTERVAL',
  intervals: setting.intervals?.length ? setting.intervals : DEFAULT_INTERVALS,
  reminderTime: setting.reminderTime ?? '08:00:00',
  timezone: setting.timezone ?? 'Asia/Ho_Chi_Minh',
  fsrsDesiredRetention: setting.fsrsDesiredRetention ?? 0.9,
  fsrsMaxIntervalDays: setting.fsrsMaxIntervalDays ?? 3650,
});
```

## 9. Save Payload Logic

Recommended:

```ts
const payload: UpdateCollectionReviewSettingRequest = {
  enabled: form.enabled,
  emailEnabled: form.emailEnabled,
  schedulerType: form.schedulerType,
  reminderTime: normalizeTime(form.reminderTime),
  timezone: form.timezone,
};

if (form.schedulerType === 'FIXED_INTERVAL') {
  payload.intervals = form.intervals;
}

if (form.schedulerType === 'FSRS') {
  payload.fsrsDesiredRetention = form.fsrsDesiredRetention;
  payload.fsrsMaxIntervalDays = form.fsrsMaxIntervalDays;
}
```

Không cần gửi `intervals` khi mode là `SM2` hoặc `FSRS`.

## 10. Validation

### 10.1. Scheduler type

Allowed:

```ts
['FIXED_INTERVAL', 'SM2', 'FSRS']
```

### 10.2. Fixed interval validation

Chỉ validate khi:

```ts
form.schedulerType === 'FIXED_INTERVAL'
```

Rules:

```text
intervals không rỗng
mỗi interval là integer
min 1
max 3650
```

### 10.3. FSRS desired retention

Backend rules:

```text
min 0.70
max 0.98
```

FE nên validate:

```ts
function validateDesiredRetention(value: number) {
  return value >= 0.7 && value <= 0.98;
}
```

UI có thể hiển thị percent:

```text
90%
```

Nhưng payload gửi backend phải là decimal:

```json
{
  "fsrsDesiredRetention": 0.9
}
```

### 10.4. FSRS max interval days

Backend rules:

```text
min 1
max 3650
```

FE validate:

```ts
function validateMaxIntervalDays(value: number) {
  return Number.isInteger(value) && value >= 1 && value <= 3650;
}
```

## 11. API Client Example

```ts
export async function getCollectionReviewSetting(
  collectionId: string
): Promise<CollectionReviewSetting> {
  const response = await api.get<ApiResponse<CollectionReviewSetting>>(
    `/collections/${collectionId}/review-setting`
  );
  return response.data.data;
}

export async function updateCollectionReviewSetting(
  collectionId: string,
  payload: UpdateCollectionReviewSettingRequest
): Promise<CollectionReviewSetting> {
  const response = await api.patch<ApiResponse<CollectionReviewSetting>>(
    `/collections/${collectionId}/review-setting`,
    payload
  );
  return response.data.data;
}
```

## 12. Review Today Impact

Không cần đổi API.

Submit review vẫn là:

```http
POST /api/v1/reviews/{vocabularyId}
Content-Type: application/json

{
  "result": "GOOD"
}
```

Response vẫn là:

```json
{
  "success": true,
  "data": {
    "status": "REVIEWING",
    "nextReviewAt": "2026-06-20T09:00:00",
    "repetitionCount": 2
  }
}
```

FE không tự tính `nextReviewAt`.

## 13. Optional: Learning Progress Fields

Backend có thể trả thêm trong learning progress:

```ts
fsrsDifficulty?: number | null;
fsrsStability?: number | null;
fsrsRetrievability?: number | null;
```

FE không bắt buộc hiển thị.

Nếu muốn hiển thị debug/admin:

```text
Difficulty: 4.8
Stability: 3.15
Retrievability: 90%
```

Không nên hiển thị cho user thường nếu UI đang tập trung vào học từ vựng.

## 14. Reset Schedule Behavior

Endpoint reset hiện tại vẫn dùng như cũ:

```http
POST /api/v1/collections/{collectionId}/review-setting/reset
Authorization: Bearer <accessToken>
```

Behavior:

- `FIXED_INTERVAL`: reset theo interval đầu tiên.
- `SM2`: reset lịch về sau 1 ngày.
- `FSRS`: reset lịch về sau 1 ngày và backend xóa FSRS memory state cũ.

FE nên giữ confirm dialog:

```text
Reset review schedule?
This will reset review timing for all vocabulary in this collection.
```

Tiếng Việt:

```text
Đặt lại lịch ôn?
Thao tác này sẽ đặt lại lịch ôn của tất cả từ vựng trong collection này.
```

## 15. Error Handling

### INVALID_INPUT

Có thể xảy ra khi:

- `fsrsDesiredRetention < 0.70`
- `fsrsDesiredRetention > 0.98`
- `fsrsMaxIntervalDays < 1`
- `fsrsMaxIntervalDays > 3650`

Suggested FE message:

```text
Please check your FSRS settings.
```

Tiếng Việt:

```text
Vui lòng kiểm tra lại thiết lập FSRS.
```

### REVIEW_SETTINGS_DISABLED

Khi reset schedule nhưng setting disabled.

Suggested message:

```text
Review settings are disabled for this collection.
```

## 16. Test Cases FE

### 16.1. Render FSRS setting

Given response:

```json
{
  "schedulerType": "FSRS",
  "fsrsDesiredRetention": 0.9,
  "fsrsMaxIntervalDays": 3650
}
```

Expected:

```text
FSRS selected
Desired retention visible
Max interval visible
Interval editor hidden/disabled
```

### 16.2. Save FSRS

Action:

```text
User selects FSRS
User sets desired retention = 0.92
User sets max interval = 1000
User clicks Save
```

Expected PATCH body:

```json
{
  "enabled": true,
  "emailEnabled": true,
  "schedulerType": "FSRS",
  "reminderTime": "08:00:00",
  "timezone": "Asia/Ho_Chi_Minh",
  "fsrsDesiredRetention": 0.92,
  "fsrsMaxIntervalDays": 1000
}
```

### 16.3. Desired retention validation

Input:

```text
0.99
```

Expected:

```text
Show validation error
Do not submit
```

### 16.4. Max interval validation

Input:

```text
0
```

Expected:

```text
Show validation error
Do not submit
```

### 16.5. Switch FSRS to SM2

Action:

```text
User changes schedulerType from FSRS to SM2
Save
```

Expected:

```json
{
  "schedulerType": "SM2"
}
```

FSRS config can remain in form state but does not need to be sent.

### 16.6. Switch FSRS to Fixed Interval

Expected:

```text
Interval editor enabled
PATCH includes intervals
```

## 17. Acceptance Criteria

FE is done when:

- User can select `FSRS`.
- User can edit `fsrsDesiredRetention`.
- User can edit `fsrsMaxIntervalDays`.
- FE validates FSRS values before submit.
- PATCH sends FSRS fields only when scheduler type is `FSRS`.
- `FIXED_INTERVAL` and `SM2` still work.
- Review Today still submits only `result`.
- FE does not calculate `nextReviewAt`.
- Reset schedule still works for all 3 modes.

## 18. Implementation Checklist

1. Update `ReviewSchedulerType` type to include `FSRS`.
2. Update `CollectionReviewSetting` type with:
   - `fsrsDesiredRetention`
   - `fsrsMaxIntervalDays`
3. Update update payload type.
4. Add FSRS option in scheduler selector.
5. Add desired retention control.
6. Add max interval control.
7. Hide/disable interval editor for `SM2` and `FSRS`.
8. Update save payload logic.
9. Add FE validation.
10. Test GET setting with `FSRS`.
11. Test PATCH setting to `FSRS`.
12. Test switching back to `SM2`.
13. Test switching back to `FIXED_INTERVAL`.
14. Test Review Today submit still works.
