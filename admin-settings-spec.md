# Quản lý Settings: `/admin/settings`

## 1. Luồng (Flow) – `/admin/settings`

### 1.1. Vai trò trang Settings

Trang **/admin/settings** là nơi cấu hình các “tham số hệ thống” dùng chung cho:

- Toàn bộ storefront (bungu.store): logo, favicon, tên shop, domain, ngôn ngữ, tiền tệ…  
- Business rule: cho phép guest checkout hay không, định dạng mã đơn hàng, thuế…  
- Giao tiếp với user: email gửi đi (from name, from email, SMTP), template cơ bản…  
- SEO & social: meta mặc định, OpenGraph, share image…  
- Integrations: Google Analytics ID, Meta Pixel,… (nếu dùng).

Tất cả setting này:

- Được lưu DB (SQLite) dạng cấu hình.  
- FE & BE đọc để quyết định hiển thị & xử lý logic.  
- Thay đổi ở admin → áp dụng (gần như) ngay cho khách truy cập.

---

### 1.2. Vòng đời 1 setting

1. **Init lần đầu (default)**  
   - Khi deploy hệ thống:
     - Seed DB với default settings:
       - Store name = “Bungu Store”  
       - Currency = JPY  
       - Timezone = Asia/Tokyo  
       - Language default = EN/JP  
       - Guest checkout = true  
     - Các giá trị nhạy cảm (API key, SMTP password…) có thể từ ENV, chỉ override bằng UI khi cần.

2. **Admin thay đổi setting**  
   - Admin truy cập `/admin/settings`.  
   - Chọn tab: General, Storefront, Localization, Checkout, Email, Integrations, Security…  
   - Thay đổi các field:
     - Ví dụ: đổi store_name, logo, default_language, cho phép guest checkout,…  
   - Bấm `Save`:
     - FE gửi request PATCH/POST tới `/api/admin/settings`.  
     - BE validate → lưu vào `settings` table.  
     - BE clear cache / reload config.

3. **Áp dụng setting**  
   - Sau khi lưu:
     - FE storefront gọi lại API config hoặc đọc từ SSR → hiển thị mới.  
     - Ví dụ:
       - Header hiển thị logo mới.  
       - Footer hiển thị địa chỉ mới.  
       - Checkout flow buộc user login nếu guest checkout = false.  

4. **Audit / lịch sử (optional)**  
   - Hệ thống có thể log lại:
     - Setting nào đã thay đổi.  
     - Giá trị cũ & mới.  
     - Ai thay đổi, vào thời điểm nào.  
   - Phục vụ debugging & compliance.

5. **Fallback & ưu tiên**  
   - Với thông tin nhạy cảm (SMTP password, API key):
     - Nếu tồn tại biến môi trường ENV → ưu tiên ENV.  
     - Nếu muốn override bằng UI → BE cho phép ghi & đọc từ DB (có mã hoá/obfuscate).  
   - Nếu setting không tìm thấy → dùng default hard-code.

---

## 2. Giao diện Admin – `/admin/settings`

### 2.1. Layout tổng

**URL:** `/admin/settings`

- Sidebar trái (admin layout) vẫn giữ như thường: Orders, Products, Collections, Content, Customers, Settings, …  
- Phần content chính của Settings chia tab:

  1. **General (Store info)**  
  2. **Storefront** (Logo, favicon, theme cơ bản)  
  3. **Localization & Currency**  
  4. **Checkout & Orders**  
  5. **Emails & Notifications**  
  6. **Integrations** (analytics, etc.)  
  7. (Optional) **Security & Admin** (nếu không có module riêng)

Mỗi tab:

- Có form riêng, nút `Save` (lưu tất cả field trong tab).  
- Khi bấm `Save`:
  - Show toast “Settings saved successfully”.  

---

### 2.2. Tab General – Store Info

Các field:

1. **Store name**
   - Input text.
   - Hiển thị:
     - Title trên browser (fallback).  
     - Ở header/footer, email template.

2. **Store description (short tagline)**
   - Textarea 1–2 lines:
     - Ví dụ: “Curated Japanese stationery and writing tools.”

3. **Store email (contact email)**
   - Email dùng cho:
     - Contact form.  
     - BCC thông báo nội bộ.  

4. **Store phone** (optional)

5. **Store address**
   - Country  
   - State/Prefecture  
   - City  
   - Address line 1/2  
   - Postal code  

6. **Default domain**
   - Ví dụ: `https://bungu.store`
   - Dùng build link & canonical URL.

7. **Timezone**
   - Select:
     - Asia/Tokyo, Asia/Ho_Chi_Minh,…  
   - Ảnh hưởng:
     - Hiển thị `created_at`, `order time`, `schedule` hiển thị trong admin & email.

---

### 2.3. Tab Storefront

Tập trung vào giao diện chung của site:

1. **Logo**
   - Upload image (png/svg).  
   - Preview.  
   - Saved as `storefront.logo_url`.

2. **Favicon**
   - Upload (ico/png).  
   - FE dùng trong `<head>`.

3. **Theme color (primary color)**
   - Color picker.  
   - Ảnh hưởng:
     - Nút chính, link, highlight.  

4. **Layout options (basic)**  
   - `Homepage hero source`:
     - Chọn 1 trong:
       - Banners (placement = home_hero)  
       - Static image URL  
   - `Show blog section on home`: checkbox.  
     - Nếu true → Home hiển thị “From Our Reads” với X posts.

5. **Footer settings**
   - `Footer text`: text/HTML ngắn.  
   - Link cấu hình:
     - Privacy Policy URL  
     - Terms & Conditions URL  
     - Contact URL  

---

### 2.4. Tab Localization & Currency

1. **Default language**
   - Select:
     - `en`, `ja`, `vi` (tuỳ việc hỗ trợ).  
   - FE đọc để set language fallback.

2. **Supported languages** (optional)
   - Multi-select: [en, ja, vi].  
   - Điều khiển hiển thị chọn language ở header.

3. **Default currency**
   - `JPY` (primary).  
   - Có thể cho chọn `USD`, `VND` nếu support multi-currency.

4. **Currency format**
   - Options:
     - `¥1,234`  
     - `1,234¥`  
   - Số thập phân: 0/2 decimal.

5. **Date & time format**
   - Date:
     - `YYYY-MM-DD`, `DD/MM/YYYY`, `MM/DD/YYYY`.  
   - Time:
     - `HH:mm` / `h:mm A`.

6. **Number format**
   - thousands separator: `,` hoặc `.`  
   - decimal separator: `.` hoặc `,`.

---

### 2.5. Tab Checkout & Orders

Cấu hình ảnh hưởng trực tiếp flow đặt hàng:

1. **Guest checkout**
   - Toggle:
     - `Allow customers to checkout without an account` (true/false).
   - Nếu false:
     - FE buộc user login/sign-up trước khi vào bước shipping/payment.

2. **Customer accounts**
   - Radio:
     - `Optional` (default).  
     - `Required` (phải login).  

3. **Required fields**
   - Checkbox list:
     - Phone number: required/optional  
     - Company: optional  
     - Postal code: required
   - BE validation dựa theo setting này.

4. **Order number format**
   - Prefix:
     - Text, ví dụ: `BG-`  
   - Pattern:
     - `{{prefix}}{{YYYY}}{{MM}}{{DD}}-{{seq}}`  
     - Hoặc đơn giản: incremental with prefix.
   - Ví dụ preview: `BG-20251126-00123`.

5. **Default shipment note / gift message**
   - Text template hiển thị ở checkout (optional).

6. **Order auto-cancel rule** (optional)
   - Nếu `unpaid` sau X ngày → mark canceled (cho COD / bank transfer).  

---

### 2.6. Tab Emails & Notifications

1. **Email sender**
   - `From name`: “Bungu Store”  
   - `From email`: `no-reply@bungu.store`
   - (Optional) `Reply-to email`: `support@bungu.store`

2. **SMTP configuration** (nếu không dùng transactional service khác):
   - `SMTP host`  
   - `SMTP port`  
   - `Username`  
   - `Password` (masked)  
   - `Use TLS/SSL` (checkbox)  
   - Button `Send test email`.

3. **System email toggles**
   - Checkbox:
     - Send order confirmation email  
     - Send shipping notification email  
     - Send refund notification email  
     - Send abandoned cart email (nếu có)  

4. **Basic template settings**  
   - Logo on emails: reuse từ Storefront.  
   - Email header text (short).  
   - Email footer (signature, social links).  
   - Mỗi template chi tiết (order confirmation, shipping, etc.) có thể là module riêng, ở đây chỉ config “global partials”.

---

### 2.7. Tab Integrations

1. **Analytics**
   - `Google Analytics Measurement ID` (GA4)  
   - `Google Tag Manager ID`  
   - `Meta Pixel ID`

2. **Search console & others**
   - `Google Search Console verification meta` (content của meta).

3. **External services**
   - (Optional) Chat widget ID, etc.

---

### 2.8. Tab Security & Admin (simple version)

1. **Password policy**
   - Min length  
   - Require number / special char (checkbox).  

2. **Session timeout**
   - X phút không hoạt động → auto logout.

3. **2FA required** (optional flag)
   - Toggle (logic implement ở module admin users).

---

## 3. Backend (BE) – Settings

### 3.1. Modules

- **SettingsService**
  - Đọc & ghi setting từ bảng `settings`.  
  - `get(key)`, `getMany(keys)`, `set(key, value, group, type)`.  
  - Cache trong memory để giảm query.

- **SettingsValidation**
  - Validate value theo `value_type`:
    - string, int, float, boolean, json, email, url, color, etc.

- **SettingsAuditService** (optional)
  - Ghi log thay đổi:
    - setting key, old value, new value, admin_id, time.

Các module khác (Orders, Checkout, EmailService…) sẽ sử dụng `SettingsService` để lấy config.

---

### 3.2. API cho Admin

#### 3.2.1. Lấy tất cả settings (hoặc theo group)

`GET /api/admin/settings`

- Query:
  - `group` (optional): `general`, `storefront`, `localization`, `checkout`, `email`, `integrations`, `security`.
- Response ví dụ:

```json
{
  "general": {
    "store_name": "Bungu Store",
    "store_email": "support@bungu.store",
    "timezone": "Asia/Tokyo",
    "default_domain": "https://bungu.store"
  },
  "storefront": {
    "logo_url": "https://cdn.../logo.png",
    "favicon_url": "https://cdn.../favicon.ico",
    "theme_primary_color": "#1A73E8"
  }
}
```

#### 3.2.2. Cập nhật settings theo group

`PATCH /api/admin/settings/:group`

- Ví dụ group = `general`:

Request:

```json
{
  "store_name": "Bungu Store Japan",
  "store_email": "hello@bungu.store",
  "store_phone": "+81-xxx",
  "timezone": "Asia/Tokyo"
}
```

BE:

- Với mỗi key trong body:
  - Check `allowed keys` theo group.  
  - Validate type (email, timezone, url,…).  
  - Lưu vào bảng `settings` (upsert).  
  - Ghi log audit.

Response:

```json
{
  "success": true
}
```

#### 3.2.3. Test email (Email settings)

`POST /api/admin/settings/email/test`

- Body: `{ "to": "admin@example.com" }`  
- BE:

  - Lấy SMTP config từ settings.  
  - Gửi email test.  
  - Trả về success/fail + message.

---

### 3.3. API cho Frontend / các service khác

- `GET /api/public/settings/basic`
  - Trả về những setting **safe** để FE dùng:
    - store_name, logo_url, primary_color, default_language, currency…  
  - Không trả thông tin nhạy cảm (SMTP, API key).

Hoặc: BE không expose route này, mà FE nhận config qua SSR/ENV. Tùy kiến trúc.

---

## 4. Database – SQLite cho Settings

### 4.1. Bảng `settings`

Dùng dạng key–value generic, có group & type:

```sql
CREATE TABLE IF NOT EXISTS settings (
  key          TEXT PRIMARY KEY,       -- ví dụ: 'general.store_name'
  value        TEXT,                   -- lưu chuỗi, có thể là JSON
  group_name   TEXT NOT NULL,          -- 'general','storefront','localization',...
  value_type   TEXT NOT NULL,          -- 'string','int','float','bool','json','email','url','color',...
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL
);
```

Ví dụ data:

| key                               | value                      | group_name   | value_type |
|-----------------------------------|----------------------------|--------------|-----------|
| general.store_name                | "Bungu Store"              | general      | string    |
| general.store_email               | "support@bungu.store"      | general      | email     |
| general.timezone                  | "Asia/Tokyo"               | general      | string    |
| storefront.logo_url               | "https://cdn.../logo.png"  | storefront   | url       |
| localization.default_lang         | "ja"                       | localization | string    |
| checkout.allow_guest              | "true"                     | checkout     | bool      |
| email.smtp_host                   | "smtp.mailgun.org"         | email        | string    |
| email.smtp_port                   | "587"                      | email        | int       |
| integrations.ga_measurement_id    | "G-XXXXXXX"                | integrations | string    |

> Lưu ý: `value` luôn là TEXT, nhưng BE parse theo `value_type` khi đọc.

---

### 4.2. Bảng `settings_audit_logs` (optional)

Để track lịch sử thay đổi:

```sql
CREATE TABLE IF NOT EXISTS settings_audit_logs (
  id           TEXT PRIMARY KEY,
  key          TEXT NOT NULL,
  old_value    TEXT,
  new_value    TEXT,
  changed_by   TEXT,       -- admin_id
  changed_at   TEXT NOT NULL
);
```

- Khi `SettingsService.set(key, newValue)`:
  - Lấy old_value từ `settings`.  
  - Insert 1 record vào `settings_audit_logs`.

---

### 4.3. Một số query gợi ý

**Lấy toàn bộ settings theo group:**

```sql
SELECT key, value, value_type
FROM settings
WHERE group_name = :group_name;
```

**Upsert 1 setting (SQLite 3.24+):**

```sql
INSERT INTO settings (key, value, group_name, value_type, created_at, updated_at)
VALUES (:key, :value, :group_name, :value_type, :now, :now)
ON CONFLICT(key) DO UPDATE SET
  value = excluded.value,
  group_name = excluded.group_name,
  value_type = excluded.value_type,
  updated_at = excluded.updated_at;
```

**Lấy 1 setting:**

```sql
SELECT value, value_type
FROM settings
WHERE key = :key;
```

BE sau đó parse:

- Nếu `value_type = 'bool'` → `"true"`/`"false"` → bool.  
- Nếu `value_type = 'int'` → cast integer.  
- Nếu `value_type = 'json'` → JSON.parse.
