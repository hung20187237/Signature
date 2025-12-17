content = r"""# Quản lý Content: Banners (`admin/content/banners`)

## 1. Luồng (Flow) – Banners

### 1.1. Banner là gì trong hệ thống này?

Banner = các khối hình ảnh + text + nút (CTA) xuất hiện ở:

- **Trang Home**:
  - Hero slider (slide lớn trên cùng: “Latest in Stationery”, “Black Friday Sale”, “Gifts That Inspire”…)
  - Promo strip nhỏ (thông báo free shipping, sale ngắn hạn,…)

- **Trang Landing / Collection**:
  - Banner đầu trang Deals (Black Friday, All Deals, Christmas…)
  - Banner đầu trang New / 2025 Award / Studio Ghibli…

- **Trang tĩnh**:
  - Banner đầu trang About Us, Our Service, Contact (nếu muốn cấu hình bằng hệ thống banner thay vì hardcode).

Mục tiêu module `admin/content/banners`:

- Cho phép **TẠO – SỬA – BẬT/TẮT – LÊN LỊCH** hiển thị banner theo vị trí (placement) trên site.

---

### 1.2. Vòng đời 1 Banner

1. **Create**  
   - Admin vào `/admin/content/banners/new`.  
   - Chọn:
     - Vị trí hiển thị (placement): home_hero, home_promo, collection_hero, deals_hero,…  
     - Nội dung: title, subtitle, mô tả ngắn, CTA text, CTA URL.  
     - Ảnh: upload hero image.  
     - Lịch hiển thị: start_at, end_at.  
     - Thứ tự ưu tiên (priority) nếu có nhiều banner cùng chỗ.
   - Lưu → banner ở trạng thái `draft` hoặc `active`.

2. **Schedule / Publish**  
   - Khi banner `is_active = 1`:
     - Nếu `start_at <= now <= end_at` → BE coi là **đang hiển thị**.  
     - Nếu `start_at > now` → banner “scheduled”, chưa hiển thị.  
     - Nếu `now > end_at` → có thể tự auto set `is_active = 0` hoặc để runtime lọc.

3. **Render trên FE**  
   - Frontend gọi:
     - `GET /api/banners?placement=home_hero`  
   - BE trả về:
     - Banner(s) phù hợp:
       - `is_active = 1`
       - `start_at <= now` và (`end_at IS NULL` hoặc `end_at >= now`)  
   - FE render slide hoặc static banner tuỳ `placement_type`.

4. **Update / Duplicate**  
   - Admin chỉnh sửa nội dung:
     - Đổi text, ảnh, thời gian chạy, CTA link, v.v.  
   - Hoặc Duplicate:
     - Clone banner cũ làm banner mới cho campaign khác.

5. **Expire / Archive**  
   - Khi chiến dịch kết thúc:
     - Cron job hoặc logic runtime nhận thấy `now > end_at` → banner không còn hiển thị.  
     - Admin có thể:
       - `Archive` banner (ẩn khỏi danh sách default, chỉ xem khi filter).  
       - Hoặc để trong `inactive`.

---

## 2. Giao diện Admin – `admin/content/banners`

### 2.1. Màn hình danh sách Banners

**URL:** `/admin/content/banners`

**Thanh filter & search:**

- Search box:
  - Tìm theo:
    - `title`
    - `placement`
    - `CTA text`
- Filter:
  - `Placement`:
    - home_hero
    - home_promo
    - collection_hero
    - deals_hero
    - about_hero
    - custom_xxx
  - `Status`:
    - active
    - draft
    - archived
  - `Date range`:
    - Date thuộc khoảng start/end
  - `Currently visible`:
    - yes/no (check theo thời gian hiện tại)

**Bảng Banners:**

| Column         | Nội dung                                                       |
|---------------|-----------------------------------------------------------------|
| Checkbox      | Chọn cho bulk actions                                           |
| Title         | Tên banner (hiển thị lớn trên slide)                           |
| Placement     | Vị trí hiển thị (home_hero / deals_hero / …)                   |
| Active period | `start_at – end_at` (hoặc “No end date”)                        |
| Status        | draft / active / archived                                       |
| Is visible now| Badge Yes/No (đã trong khung giờ hiển thị hay chưa)            |
| Priority      | Thứ tự ưu tiên (số nhỏ hiển thị trước)                         |
| Updated At    | Thời gian cập nhật gần nhất                                    |

**Bulk actions:**

- `Set active`
- `Set inactive`
- `Archive`
- (Optional) `Delete` (khuyến nghị hạn chế)

**Action per row:**

- `Edit`
- `Duplicate`
- `Preview`
- `Archive` / `Unarchive`

---

### 2.2. Màn hình tạo/sửa Banner

**URL tạo mới:** `/admin/content/banners/new`  
**URL sửa:** `/admin/content/banners/:id`

Có thể chia thành nhóm field (section):

#### 2.2.1. Section: Thông tin cơ bản

- `Title` (text, required)  
  - Ví dụ: “Black Friday is Here!”  
- `Subtitle` (text, optional)  
  - Ví dụ: “Up to 50% off on select stationery”  
- `Description` (textarea / rich-text, optional)  
  - Hiển thị dưới subtitle hoặc bên cạnh tùy kiểu layout.

#### 2.2.2. Section: Vị trí & Layout

- `Placement` (select, required):
  - `home_hero` – Hero slider trên Home.  
  - `home_promo` – Banner promo horizontal nhỏ dưới header.  
  - `collection_hero` – Banner lớn đầu trang collection (New, Deals, Awards).  
  - `deals_hero` – Hero riêng cho trang Deals.  
  - `about_hero` – Banner đầu trang About Us.  
  - Có thể thêm `custom` cho các trang khác.

- `Layout type` (select):
  - `full_width_image` – Ảnh chiếm hết chiều rộng, text overlay.  
  - `split_image_text` – 50% image / 50% text.  
  - `centered_card` – Card text ở giữa trên nền ảnh.  

**Lưu ý:** Layout type giúp FE chọn component render phù hợp.

#### 2.2.3. Section: Media

- `Desktop image`:
  - Upload / chọn file (`banner_desktop_url`).  
  - Khuyến nghị aspect ratio: 16:9 hoặc 21:9 (hero).  
- `Mobile image`:
  - Upload / chọn file (`banner_mobile_url`) – nếu để trống thì FE dùng desktop image và CSS crop lại.  

- Option:
  - `Alt text` – cho SEO & accessibility.

#### 2.2.4. Section: CTA

- `CTA text`:
  - Ví dụ: “Shop Deals”, “Learn More”, “Shop Now”.  
- `CTA URL`:
  - `/collections/all-deals`, `/pages/about-us`, external URL.  
- `Open in new tab` (checkbox) – optional, thường là false cho link nội bộ.

Có thể hỗ trợ **2 CTA** (primary & secondary), nhưng đơn giản hóa thì 1 CTA là đủ.

#### 2.2.5. Section: Lịch & trạng thái

- `Status`:
  - `draft` / `active` / `archived`  
- `Start at`:
  - Datetime picker (múi giờ store).  
- `End at`:
  - Datetime picker (có thể để trống nếu banner luôn hiển thị đến khi tắt tay).  
- `Priority`:
  - Số nguyên, mặc định 100.  
  - Banner có priority nhỏ hơn sẽ hiển thị trước trong cùng placement (top slide).

**Hiển thị preview nhanh:**

- Một khung “Preview” bên phải:
  - Render text + ảnh + CTA theo layout & placement.

---

## 3. Backend (BE) – Banners

### 3.1. Modules / Service

- **BannerService**
  - CRUD banners.  
  - Tính “currently visible”.  
  - Trả về banners theo placement cho FE shop.

- **FileService / MediaService**
  - Quản lý upload file ảnh, trả URL. (Có thể dùng dịch vụ ngoài như S3, nhưng spec này không đi sâu.)

### 3.2. API cho Admin

#### List banners

`GET /api/admin/banners`

Query:

- `q` (search theo title)  
- `placement`  
- `status`  
- `visible_now` (true/false)  
- `page`, `limit`

Response:

```json
{
  "data": [
    {
      "id": "b1",
      "title": "Black Friday is Here!",
      "placement": "home_hero",
      "status": "active",
      "start_at": "2025-11-25T00:00:00Z",
      "end_at": "2025-12-02T23:59:59Z",
      "priority": 10,
      "is_visible_now": true,
      "updated_at": "2025-11-26T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5
  }
}
