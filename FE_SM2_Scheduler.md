# FE Guide: Review Scheduler Mode (Fixed Interval + SM-2)

## 1. Mục tiêu FE

Backend đã hỗ trợ chọn thuật toán review ở cấp collection review setting.

FE cần cập nhật UI để user có thể chọn mode:

- `FIXED_INTERVAL`: dùng interval thủ công như hiện tại, ví dụ `[1, 3, 7, 14, 30]`.
- `SM2`: dùng thuật toán SM-2, tự điều chỉnh lịch ôn theo kết quả user bấm `AGAIN`, `HARD`, `GOOD`, `EASY`.
- `FSRS`: chưa support trong phase này. FE có thể hiển thị disabled/coming soon, hoặc chưa hiển thị.

Mục tiêu cụ thể:

- Trong màn hình collection review setting, thêm control chọn scheduler mode.
- Khi chọn `FIXED_INTERVAL`, vẫn cho chỉnh interval như hiện tại.
- Khi chọn `SM2`, ẩn hoặc disable phần interval thủ công vì SM-2 không dùng interval list để tính lịch sau mỗi lần review.
- Khi submit review, FE không cần gửi scheduler mode. Backend tự lấy mode từ collection setting.
- Màn hình `Review Today` vẫn dùng API cũ, không cần đổi flow review.

## 2. Khái niệm cần hiểu

### 2.1. Fixed Interval

Đây là cơ chế cũ.

Collection có interval list:

```json
[1, 3, 7, 14, 30]
```

Khi user review:

- `AGAIN`: quay về interval đầu tiên.
- `GOOD`, `HARD`, `EASY`: backend chọn interval dựa theo số lần đã review.

Mode này phù hợp nếu user muốn tự kiểm soát lịch ôn.

### 2.2. SM-2

SM-2 là thuật toán spaced repetition đơn giản hơn FSRS nhưng thông minh hơn fixed interval.

User vẫn bấm 4 nút như hiện tại:

```text
AGAIN
HARD
GOOD
EASY
```

Backend sẽ tự tính:

- `easeFactor`
- `repetitionCount`
- `lastIntervalDays`
- `nextReviewAt`

FE không cần tự tính ngày review tiếp theo.

### 2.3. FSRS

FSRS là phase sau.

Trong backend enum đã có `FSRS`, nhưng hiện tại backend sẽ reject nếu FE gửi:

```json
{
  "schedulerType": "FSRS"
}
```

Backend trả lỗi:

```json
{
  "success": false,
  "error": {
    "code": "SCHEDULER_NOT_SUPPORTED"
  }
}
```

## 3. API Contract

Base path hiện tại:

```text
/api/v1
```

Các endpoint liên quan:

```text
GET   /collections/{collectionId}/review-setting
PATCH /collections/{collectionId}/review-setting
POST  /collections/{collectionId}/review-setting/reset
GET   /reviews/today
POST  /reviews/{vocabularyId}
```

Tên endpoint có thể đang nằm trong `CollectionReviewSettingController`. Nếu FE đã có API review setting thì chỉ cần thêm field `schedulerType`.

## 4. GET Collection Review Setting

### Request

```http
GET /api/v1/collections/{collectionId}/review-setting
Authorization: Bearer <accessToken>
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
    "schedulerType": "FIXED_INTERVAL",
    "intervals": [1, 3, 7, 14, 30],
    "reminderTime": "08:00:00",
    "timezone": "Asia/Ho_Chi_Minh",
    "lastResetAt": null,
    "createdAt": "2026-06-14T09:00:00",
    "updatedAt": "2026-06-14T09:00:00"
  }
}
```

### Field mới

```ts
schedulerType: 'FIXED_INTERVAL' | 'SM2' | 'FSRS'
```

Backend default:

```text
FIXED_INTERVAL
```

Nếu backend trả `null` do dữ liệu cũ hoặc cache cũ, FE nên fallback hiển thị:

```text
FIXED_INTERVAL
```

## 5. PATCH Collection Review Setting

### Request

```http
PATCH /api/v1/collections/{collectionId}/review-setting
Authorization: Bearer <accessToken>
Content-Type: application/json
```

### Body khi chỉ đổi scheduler

```json
{
  "schedulerType": "SM2"
}
```

### Body khi đổi về fixed interval

```json
{
  "schedulerType": "FIXED_INTERVAL"
}
```

### Body khi đổi fixed interval + intervals

```json
{
  "schedulerType": "FIXED_INTERVAL",
  "intervals": [1, 3, 7, 14, 30]
}
```

### Body đầy đủ

```json
{
  "enabled": true,
  "emailEnabled": true,
  "schedulerType": "SM2",
  "intervals": [1, 3, 7, 14, 30],
  "reminderTime": "08:00:00",
  "timezone": "Asia/Ho_Chi_Minh"
}
```

Ghi chú:

- Các field đều optional khi PATCH.
- Nếu FE chỉ muốn đổi scheduler, chỉ gửi `schedulerType`.
- Với mode `SM2`, FE có thể không gửi `intervals`.
- Không gửi `FSRS` trong phase này.

### Response success

```json
{
  "success": true,
  "data": {
    "id": "8f36f402-7fd8-4b7c-9246-6db2a5dbe0c7",
    "collectionId": "9b51c9af-c7da-4d83-99ad-89f3b4db83ff",
    "enabled": true,
    "emailEnabled": true,
    "schedulerType": "SM2",
    "intervals": [1, 3, 7, 14, 30],
    "reminderTime": "08:00:00",
    "timezone": "Asia/Ho_Chi_Minh",
    "lastResetAt": null,
    "createdAt": "2026-06-14T09:00:00",
    "updatedAt": "2026-06-14T09:05:00"
  }
}
```

### Response khi gửi FSRS

```json
{
  "success": false,
  "error": {
    "code": "SCHEDULER_NOT_SUPPORTED",
    "message": "Review scheduler is not supported yet"
  }
}
```

FE nên hiển thị message kiểu:

```text
FSRS is not available yet.
```

hoặc tiếng Việt:

```text
FSRS chưa được hỗ trợ trong phiên bản này.
```

## 6. TypeScript Types đề xuất

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
}
```

Nếu codebase có API wrapper chung:

```ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}
```

## 7. UI/UX đề xuất

### 7.1. Vị trí UI

Thêm phần chọn scheduler trong màn hình:

```text
Collection Detail -> Review Settings
```

hoặc nơi FE hiện đang chỉnh:

```text
enabled
emailEnabled
intervals
reminderTime
timezone
```

### 7.2. Control nên dùng

Nên dùng segmented control hoặc radio group:

```text
Review algorithm

[ Fixed interval ] [ SM-2 ] [ FSRS ]
```

Khuyến nghị:

- `Fixed interval`: enabled.
- `SM-2`: enabled.
- `FSRS`: disabled, label phụ `Coming soon`.

Không nên dùng dropdown nếu chỉ có 2-3 lựa chọn, vì segmented/radio rõ nghĩa hơn.

### 7.3. Copy text gợi ý

Label:

```text
Review algorithm
```

Option `FIXED_INTERVAL`:

```text
Fixed interval
```

Description:

```text
Use your custom day intervals.
```

Option `SM2`:

```text
SM-2
```

Description:

```text
Automatically adjusts review dates based on your answers.
```

Option `FSRS`:

```text
FSRS
```

Description:

```text
Coming soon.
```

Nếu UI tiếng Việt:

```text
Thuật toán ôn tập

Lịch cố định
Dùng các mốc ngày bạn tự đặt.

SM-2
Tự điều chỉnh lịch ôn dựa trên kết quả bạn chọn.

FSRS
Sắp ra mắt.
```

### 7.4. Hiển thị interval editor

Khi:

```ts
schedulerType === 'FIXED_INTERVAL'
```

Hiển thị editor interval như hiện tại.

Ví dụ UI:

```text
Intervals
[ 1 ] [ 3 ] [ 7 ] [ 14 ] [ 30 ] days
```

Khi:

```ts
schedulerType === 'SM2'
```

Ẩn hoặc disable interval editor.

Khuyến nghị: disable và hiển thị text ngắn:

```text
Intervals are managed automatically by SM-2.
```

Tiếng Việt:

```text
SM-2 sẽ tự tính lịch ôn, không dùng mốc ngày thủ công.
```

Không nên cho user chỉnh intervals trong mode `SM2` vì backend không dùng intervals để tính lịch sau mỗi lần review.

### 7.5. Reset schedule behavior

Nếu user bấm reset schedule:

- `FIXED_INTERVAL`: backend reset `nextReviewAt` theo interval đầu tiên.
- `SM2`: backend reset `nextReviewAt` sau 1 ngày.

FE nên show confirm dialog:

```text
Reset review schedule?
This will reset progress scheduling for all vocabulary in this collection.
```

Tiếng Việt:

```text
Đặt lại lịch ôn?
Thao tác này sẽ đặt lại lịch ôn của tất cả từ vựng trong collection này.
```

## 8. State handling đề xuất

### 8.1. Load setting

Flow:

```text
Page open
-> GET review setting
-> set form state
-> if schedulerType missing/null, use FIXED_INTERVAL
```

Pseudo-code:

```ts
const setting = await getCollectionReviewSetting(collectionId);

setForm({
  enabled: setting.enabled,
  emailEnabled: setting.emailEnabled,
  schedulerType: setting.schedulerType ?? 'FIXED_INTERVAL',
  intervals: setting.intervals?.length ? setting.intervals : [1, 3, 7, 14, 30],
  reminderTime: setting.reminderTime,
  timezone: setting.timezone ?? 'Asia/Ho_Chi_Minh',
});
```

### 8.2. Change scheduler mode

Khi user chọn `SM2`:

```ts
setForm(prev => ({
  ...prev,
  schedulerType: 'SM2',
}));
```

Không cần xoá intervals khỏi state. Chỉ không gửi intervals nếu không cần.

### 8.3. Save setting

Payload đề xuất:

```ts
const payload: UpdateCollectionReviewSettingRequest = {
  enabled: form.enabled,
  emailEnabled: form.emailEnabled,
  schedulerType: form.schedulerType,
  reminderTime: form.reminderTime,
  timezone: form.timezone,
};

if (form.schedulerType === 'FIXED_INTERVAL') {
  payload.intervals = form.intervals;
}
```

Lý do:

- Tránh gửi intervals khi mode là `SM2`.
- Giữ payload rõ nghĩa.

### 8.4. Optimistic update

Không khuyến nghị optimistic update cho setting này.

Nên:

```text
Save button loading
-> PATCH
-> update state bằng response từ backend
-> show toast success
```

Nếu lỗi:

```text
-> giữ form state hiện tại
-> show error message
```

## 9. Validation FE

### 9.1. Scheduler type

Allowed in FE:

```ts
const enabledSchedulerTypes = ['FIXED_INTERVAL', 'SM2'];
```

`FSRS` disabled.

### 9.2. Intervals

Chỉ validate intervals khi:

```ts
schedulerType === 'FIXED_INTERVAL'
```

Rule:

```text
- intervals không rỗng
- mỗi item là integer
- min 1
- max 3650
```

Backend cũng validate tương tự.

### 9.3. Reminder time

Format gửi backend:

```text
HH:mm:ss
```

Ví dụ:

```text
08:00:00
```

Nếu input HTML type time trả `HH:mm`, FE nên convert:

```ts
function normalizeTime(value: string | null): string | null {
  if (!value) return null;
  return value.length === 5 ? `${value}:00` : value;
}
```

### 9.4. Timezone

Nếu FE có timezone picker, gửi IANA timezone:

```text
Asia/Ho_Chi_Minh
```

Nếu không có, có thể giữ giá trị backend trả về.

## 10. Review Today không cần đổi lớn

Endpoint:

```http
GET /api/v1/reviews/today
```

Không cần gửi scheduler mode.

Backend tự tính item nào tới hạn bằng:

```text
nextReviewAt <= now
```

Submit review vẫn như cũ:

```http
POST /api/v1/reviews/{vocabularyId}
Content-Type: application/json

{
  "result": "GOOD"
}
```

Response vẫn như cũ:

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

FE chỉ cần hiển thị `nextReviewAt` từ backend nếu đang có.

Không tự tính next review date ở FE.

## 11. Edge cases FE cần xử lý

### 11.1. Backend trả schedulerType null

Fallback:

```ts
const schedulerType = setting.schedulerType ?? 'FIXED_INTERVAL';
```

### 11.2. User chọn FSRS bằng cách sửa devtools

Nếu request gửi `FSRS`, backend trả `SCHEDULER_NOT_SUPPORTED`.

FE handle:

```text
FSRS chưa được hỗ trợ.
```

### 11.3. User chuyển từ FIXED_INTERVAL sang SM2

Không cần reset schedule bắt buộc.

Behavior:

- Các từ đã có `nextReviewAt` vẫn giữ lịch hiện tại.
- Từ lần review tiếp theo, backend sẽ tính lịch mới bằng SM-2.

FE có thể hiển thị gợi ý:

```text
SM-2 will be applied from the next review.
```

Tiếng Việt:

```text
SM-2 sẽ được áp dụng từ lần ôn tiếp theo.
```

### 11.4. User chuyển từ SM2 về FIXED_INTERVAL

Behavior:

- Từ lần review tiếp theo, backend dùng interval list.
- `easeFactor`, `lastIntervalDays`, `lapseCount`, `reviewCount` vẫn được lưu trong DB nhưng không ảnh hưởng fixed interval.

### 11.5. Reset schedule trong SM2

Backend sẽ reset các từ về trạng thái ban đầu và set lịch sau 1 ngày.

FE không cần xử lý riêng, chỉ gọi endpoint reset như hiện tại.

## 12. Component structure đề xuất

Nếu codebase React:

```text
components/
  review-settings/
    ReviewSettingsPanel.tsx
    SchedulerModeSelector.tsx
    IntervalEditor.tsx
    ReminderSettings.tsx
```

### SchedulerModeSelector props

```ts
interface SchedulerModeSelectorProps {
  value: ReviewSchedulerType;
  onChange: (value: ReviewSchedulerType) => void;
  disabled?: boolean;
}
```

### IntervalEditor props

```ts
interface IntervalEditorProps {
  value: number[];
  onChange: (value: number[]) => void;
  disabled?: boolean;
}
```

Render logic:

```tsx
<SchedulerModeSelector
  value={form.schedulerType}
  onChange={(schedulerType) => setForm(prev => ({ ...prev, schedulerType }))}
/>

<IntervalEditor
  value={form.intervals}
  onChange={(intervals) => setForm(prev => ({ ...prev, intervals }))}
  disabled={form.schedulerType !== 'FIXED_INTERVAL'}
/>
```

## 13. Suggested API client functions

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

## 14. Test cases FE

### 14.1. Render default fixed interval

Given:

```json
{
  "schedulerType": "FIXED_INTERVAL",
  "intervals": [1, 3, 7, 14, 30]
}
```

Expected:

```text
Fixed interval selected
Interval editor enabled
```

### 14.2. Render SM2

Given:

```json
{
  "schedulerType": "SM2",
  "intervals": [1, 3, 7, 14, 30]
}
```

Expected:

```text
SM-2 selected
Interval editor disabled or hidden
SM-2 explanation visible
```

### 14.3. Save SM2

Action:

```text
User selects SM-2
User clicks Save
```

Expected PATCH body:

```json
{
  "enabled": true,
  "emailEnabled": true,
  "schedulerType": "SM2",
  "reminderTime": "08:00:00",
  "timezone": "Asia/Ho_Chi_Minh"
}
```

No `intervals` required.

### 14.4. Save fixed interval

Action:

```text
User selects Fixed interval
User edits intervals
User clicks Save
```

Expected PATCH body:

```json
{
  "enabled": true,
  "emailEnabled": true,
  "schedulerType": "FIXED_INTERVAL",
  "intervals": [1, 3, 7, 14, 30],
  "reminderTime": "08:00:00",
  "timezone": "Asia/Ho_Chi_Minh"
}
```

### 14.5. FSRS disabled

Expected:

```text
FSRS option visible but disabled
Clicking FSRS does not send PATCH
```

### 14.6. Backend rejects FSRS

If request returns:

```json
{
  "success": false,
  "error": {
    "code": "SCHEDULER_NOT_SUPPORTED"
  }
}
```

Expected:

```text
Show clear error message
Keep previous selected value or revert to backend value
```

## 15. Acceptance criteria FE

FE hoàn thành khi:

- Review setting response đọc được `schedulerType`.
- UI có option chọn `Fixed interval` và `SM-2`.
- `FSRS` không thể chọn trong phase này.
- Chọn `SM-2` rồi save gửi `schedulerType: "SM2"`.
- Chọn `Fixed interval` rồi save gửi `schedulerType: "FIXED_INTERVAL"` và `intervals`.
- Interval editor chỉ active khi mode là `FIXED_INTERVAL`.
- Review Today vẫn hoạt động như cũ.
- Submit review vẫn gửi `{ "result": "AGAIN" | "HARD" | "GOOD" | "EASY" }`.
- FE không tự tính `nextReviewAt`.
- Error `SCHEDULER_NOT_SUPPORTED` được xử lý rõ ràng.

## 16. Quick checklist cho FE

1. Update type `CollectionReviewSetting` thêm `schedulerType`.
2. Update type `UpdateCollectionReviewSettingRequest` thêm `schedulerType`.
3. Update API client nếu đang strict typing.
4. Thêm `SchedulerModeSelector`.
5. Disable/hide interval editor khi `schedulerType === 'SM2'`.
6. Disable `FSRS` hoặc chưa render.
7. Update save payload logic.
8. Test GET setting.
9. Test PATCH sang `SM2`.
10. Test PATCH về `FIXED_INTERVAL`.
11. Test submit review vẫn hoạt động.
12. Test reset schedule vẫn hoạt động.
