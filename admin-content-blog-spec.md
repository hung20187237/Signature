# Quản lý Blog: `admin/content/blog`

## 1. Luồng (Flow) – Blog / Reads

### 1.1. Mục tiêu module Blog

Trong bối cảnh bungu.store, Blog có thể là:

- **Reads / bungu.news**:
  - Bài review sản phẩm, hướng dẫn sử dụng.
  - Bài viết về stationery, event, trải nghiệm viết, v.v.
- **Content marketing**:
  - Bài “Gift guide”, “How to choose X”, “Top 10 …”.
- **Thông báo / news**:
  - Thông báo event, promotion, shipping schedule holiday…

Module `admin/content/blog` cho phép:

- Tạo / sửa / xoá bài viết.
- Quản lý **category**, **tag**.
- Gắn bài viết ra frontend:
  - Trang Reads/Blog.
  - Block “From Our Reads” trên Home / Product detail.

---

### 1.2. Vòng đời 1 bài blog

1. **Draft (nháp)**  
   - Content / marketing tạo bài viết ở trạng thái `draft`:
     - Có title, slug (handle), nội dung, ảnh thumbnail, category, tags.  
   - Chưa public, chỉ admin/author xem được.

2. **Review (duyệt)** – optional  
   - Nếu có quy trình: người viết xong nháp, gán tag `needs_review` hoặc set status `in_review`.  
   - Editor / manager vào đọc, chỉnh sửa, approve.

3. **Schedule / Publish**  
   - Khi bài viết sẵn sàng:
     - Set `status = 'published'`.
     - Chọn `published_at`:  
       - Ngay lập tức = `now`.  
       - Hoặc chọn thời điểm tương lai để **schedule**.
   - FE chỉ hiển thị bài:
     - `status = 'published'`
     - `published_at <= now`.

4. **Update / Optimize**  
   - Sau khi public, có thể:
     - Update nội dung, sửa typo.  
     - Cập nhật SEO title, meta, ảnh thumbnail.  
     - Update tags, category.  
   - `updated_at` thay đổi nhưng `published_at` có thể giữ nguyên (để giữ thứ tự).

5. **Archive / Unpublish**  
   - Khi không muốn hiển thị nữa:
     - Đặt `status = 'archived'` hoặc `status = 'draft'` lại.  
   - Bài không còn hiển thị trên blog list, nhưng URL vẫn có thể 404 hoặc redirect (tuỳ chính sách).

---

## 2. Giao diện Admin – `admin/content/blog`

Có 3 màn chính:

- **Danh sách bài viết**: `/admin/content/blog`  
- **Chi tiết bài viết / editor**: `/admin/content/blog/:id`  
- **Quản lý category & tag**: `/admin/content/blog/categories`, `/admin/content/blog/tags`

---

### 2.1. Màn hình danh sách bài viết (Posts List)

**URL:** `/admin/content/blog`

**Thanh filter & search:**

- Search box:
  - Tìm theo:
    - Title
    - Slug
    - Nội dung (optional: full-text)
- Filter:
  - `Status`:
    - draft
    - in_review (optional)
    - published
    - archived
  - `Category`:
    - News, Guides, Reviews, Gift Guide, Event, v.v.
  - `Author`:
    - filter theo tác giả.
  - `Published range`:
    - From – To

**Bảng Posts:**

| Column        | Nội dung                                                   |
|--------------|-------------------------------------------------------------|
| Checkbox     | Chọn cho bulk actions                                       |
| Title        | Tiêu đề bài viết (click → mở editor)                        |
| Category     | Category chính                                              |
| Tags         | Hiển thị vài tag (nhiều → “+X”)                             |
| Author       | Tên tác giả                                                |
| Status       | draft / in_review / published / archived                    |
| Published At | Thời điểm public                                           |
| Updated At   | Thời điểm chỉnh sửa gần nhất                               |

**Bulk actions:**

- `Set status: published`
- `Set status: draft`
- `Archive`
- `Delete` (khuyến nghị hạn chế)

**Nút “New Post”** (góc trên bên phải):

- Dẫn tới `/admin/content/blog/new`.

---

### 2.2. Màn hình tạo / chỉnh sửa bài viết (Post Editor)

**URL tạo:** `/admin/content/blog/new`  
**URL sửa:** `/admin/content/blog/:id`

Layout gợi ý:

- Cột trái (phần nội dung):
  - Title, slug, editor nội dung.  
- Cột phải (sidebar):
  - Status, Published at, Category, Tags, Thumbnail, SEO.

#### 2.2.1. Phần nội dung chính

- `Title` (text, bắt buộc)  
- `Slug` (text, auto-generate từ title, có thể chỉnh):
  - Dùng cho URL: `/blog/{slug}`.  
- `Excerpt` (textarea ngắn):
  - Tóm tắt bài (50–160 ký tự) – dùng cho listing & SEO description fallback.  
- `Content`:
  - Rich-text editor (WYSIWYG) hoặc markdown editor, hỗ trợ:
    - Heading (H2, H3…)  
    - Paragraph  
    - Bold, italic, underline  
    - Bullet / Numbered list  
    - Quotes  
    - Inline code (optional)  
    - Link  
    - Insert image:
      - Upload ảnh hoặc paste URL.  

**Optional**: block “Related products / collections” gắn link tới product / collection.

#### 2.2.2. Sidebar: Status & Visibility

Block “Status”:

- `Status` (select):
  - draft  
  - in_review (optional)  
  - published  
  - archived  

- `Published at`:
  - Datetime picker:
    - Nếu để trống khi set `published` → auto set `now`.  
    - Nếu chọn thời điểm tương lai → bài **scheduled**.

- Nút:

  - `Save draft`  
  - `Publish now`  
  - `Preview` (mở trang FE `/blog/:slug?preview=token`)

#### 2.2.3. Sidebar: Category & Tags

- `Category` (select đơn):
  - Dropdown: News / Guides / Reviews / Gift Guide / Event…  
  - Có nút `Manage categories` → mở page category management.

- `Tags` (multi-input):
  - Tag input (type → enter):
    - `pen`, `notebook`, `studio ghibli`, `gift`, `black friday`…
  - Gợi ý từ tag đã tồn tại (autocomplete).

#### 2.2.4. Sidebar: Thumbnail & SEO

- `Thumbnail image`:
  - Upload / chọn file → `thumbnail_url`.
  - Preview ảnh nhỏ.
  - Alt text riêng cho thumbnail (optional).

- `SEO`:
  - `SEO title`:
    - Default = title, nhưng cho phép override (ngắn hơn).  
  - `Meta description`:
    - Default = excerpt nếu không set.  
  - `SEO slug`:
    - Thường trùng `slug`, chỉ hiển thị để confirm.

**Preview SEO snippet:**

- Hiển thị kiểu Google search:
  - Title  
  - URL  
  - Description

---

### 2.3. Màn hình quản lý Category

**URL:** `/admin/content/blog/categories`

- Bảng:

  | Category name | Slug         | Description | Post count |
  |---------------|-------------|------------|------------|

- Nút:
  - `Add category` → form:
    - Name
    - Slug
    - Description

---

### 2.4. Màn hình quản lý Tags (optional riêng)

**URL:** `/admin/content/blog/tags`

- Bảng đơn giản:

  | Tag name | Slug       | Post count |
  |----------|------------|------------|

- Cho phép:
  - Rename tag (update name/slug)
  - Merge tag (optional)

---

## 3. Backend (BE) – Blog

### 3.1. Các module chính

- **BlogService / PostService**
  - CRUD bài viết.  
  - Xử lý slug, trạng thái, published_at.  
  - Tìm kiếm, filter.  

- **CategoryService**
  - CRUD category.  

- **TagService**
  - CRUD tag + gắn tag vào post.  

- **AuthorService** (optional, nếu không muốn reuse admin_users)
  - Quản lý thông tin tác giả (name, bio, avatar).

---

### 3.2. API cho Admin

#### 3.2.1. List posts

`GET /api/admin/blog/posts`

Query params:

- `q` (search title/slug)  
- `status`  
- `category_id`  
- `author_id`  
- `published_from`, `published_to`  
- `page`, `limit`

Response:

```json
{
  "data": [
    {
      "id": "post1",
      "title": "Top 5 Japanese Pens for Daily Use",
      "slug": "top-5-japanese-pens-for-daily-use",
      "status": "published",
      "category_id": "cat_guides",
      "category_name": "Guides",
      "author_id": "admin1",
      "author_name": "Bungu Editorial Team",
      "published_at": "2025-11-20T10:00:00Z",
      "updated_at": "2025-11-21T08:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42
  }
}
```

#### 3.2.2. Get detail post

`GET /api/admin/blog/posts/:id`

Trả về full:

- Post info (title, slug, content, excerpt…)  
- Category  
- Tags  
- Author  
- SEO info  

#### 3.2.3. Create post

`POST /api/admin/blog/posts`

Body ví dụ:

```json
{
  "title": "Top 5 Japanese Pens for Daily Use",
  "slug": "top-5-japanese-pens-for-daily-use",
  "excerpt": "A curated list of Japanese pens perfect for everyday writing.",
  "content_html": "<p>...</p>",
  "status": "draft",
  "category_id": "cat_guides",
  "tag_ids": ["tag_pens", "tag_japan"],
  "thumbnail_url": "https://cdn.example.com/blog/thumb_pens.jpg",
  "seo_title": "Top 5 Japanese Pens for Daily Use",
  "seo_description": "Discover our top 5 Japanese pens for everyday writing.",
  "published_at": null
}
```

BE:

- Validate slug unique.  
- Nếu slug trống → auto-generate từ title.  
- Lưu vào SQLite, set `created_at`, `updated_at`.

#### 3.2.4. Update post

`PATCH /api/admin/blog/posts/:id`

- Cho phép update mọi field (trừ id):
  - Nếu đổi slug → cần check unique mới.  
  - Nếu set `status = 'published'` và `published_at` null → set `published_at = now`.

#### 3.2.5. Delete / Archive

- `DELETE /api/admin/blog/posts/:id`
  - Hard delete (tuỳ policy).
- Hoặc:
  - `PATCH /api/admin/blog/posts/:id/status`
    - Body: `{ "status": "archived" }`.

#### 3.2.6. Category & Tag APIs

- `GET /api/admin/blog/categories`
- `POST /api/admin/blog/categories`
- `PATCH /api/admin/blog/categories/:id`
- `DELETE /api/admin/blog/categories/:id` (cẩn trọng, cần reassign post)

- `GET /api/admin/blog/tags`
- `POST /api/admin/blog/tags`
- `PATCH /api/admin/blog/tags/:id`
- `DELETE /api/admin/blog/tags/:id` (nên merge trước)

---

### 3.3. API cho Frontend (public)

#### 3.3.1. List posts

`GET /api/blog/posts`

Query:

- `page`, `limit`
- `category_slug`
- `tag_slug`
- `q` (search)
- `sort` (newest / popular – nếu có view count)

BE:

- Filter:
  - `status = 'published'`
  - `published_at <= now`
- Pagination.

Response:

```json
{
  "data": [
    {
      "id": "post1",
      "slug": "top-5-japanese-pens-for-daily-use",
      "title": "Top 5 Japanese Pens for Daily Use",
      "excerpt": "A curated list of Japanese pens...",
      "thumbnail_url": "https://...",
      "category": { "slug": "guides", "name": "Guides" },
      "tags": [
        { "slug": "pens", "name": "Pens" },
        { "slug": "japan", "name": "Japan" }
      ],
      "published_at": "2025-11-20T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 120
  }
}
```

#### 3.3.2. Get single post by slug

`GET /api/blog/posts/:slug`

- BE:
  - Tìm `blog_posts` theo `slug`.
  - Kiểm tra:
    - `status = 'published'`
    - `published_at <= now`
- Trả:
  - Post
  - Category
  - Tags
  - Related posts (optional)

```json
{
  "post": {
    "id": "post1",
    "title": "Top 5 Japanese Pens for Daily Use",
    "slug": "top-5-japanese-pens-for-daily-use",
    "content_html": "<h2>...</h2><p>...</p>",
    "excerpt": "...",
    "thumbnail_url": "https://...",
    "published_at": "2025-11-20T10:00:00Z",
    "seo_title": "...",
    "seo_description": "..."
  },
  "category": { "name": "Guides", "slug": "guides" },
  "tags": [
    { "name": "Pens", "slug": "pens" },
    { "name": "Japan", "slug": "japan" }
  ],
  "related_posts": [
    { "slug": "how-to-choose-a-fountain-pen", "title": "How to Choose a Fountain Pen", "thumbnail_url": "..." }
  ]
}
```

#### 3.3.3. “From Our Reads” block (Home / Product page)

`GET /api/blog/featured`

- Có thể đơn giản:
  - Lấy X bài mới nhất trong category `Guides` hoặc `News`.  
- Hoặc hỗ trợ:
  - Flag `is_featured` trong post.

---

## 4. Database – SQLite cho Blog

### 4.1. Bảng `blog_posts`

```sql
CREATE TABLE IF NOT EXISTS blog_posts (
  id                TEXT PRIMARY KEY,         -- UUID string
  title             TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,     -- dùng cho URL

  excerpt           TEXT,                     -- tóm tắt ngắn
  content_html      TEXT NOT NULL,            -- nội dung full (HTML hoặc markdown render)

  status            TEXT NOT NULL DEFAULT 'draft',  -- 'draft','in_review','published','archived'
  category_id       TEXT,                     -- FK tới blog_categories
  author_id         TEXT,                     -- FK tới admin_users / blog_authors

  thumbnail_url     TEXT,
  seo_title         TEXT,
  seo_description   TEXT,

  is_featured       INTEGER NOT NULL DEFAULT 0, -- 0/1 – dùng cho block "From Our Reads"

  published_at      TEXT,                     -- ISO8601 hoặc NULL nếu chưa publish
  created_at        TEXT NOT NULL,
  updated_at        TEXT NOT NULL
);
```

### 4.2. Bảng `blog_categories`

```sql
CREATE TABLE IF NOT EXISTS blog_categories (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);
```

> Một bài post chỉ có **1 category** (simple). Nếu muốn multi-category, sẽ cần bảng liên kết.

### 4.3. Bảng `blog_tags` & `blog_post_tags`

```sql
CREATE TABLE IF NOT EXISTS blog_tags (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS blog_post_tags (
  post_id     TEXT NOT NULL,
  tag_id      TEXT NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES blog_tags(id) ON DELETE CASCADE
);
```

### 4.4. Bảng `blog_authors` (optional)

Nếu không muốn reuse `admin_users`, có thể có bảng riêng:

```sql
CREATE TABLE IF NOT EXISTS blog_authors (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  bio         TEXT,
  avatar_url  TEXT,
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);
```

- `blog_posts.author_id` → `blog_authors.id`.

---

### 4.5. Một số query gợi ý

**List posts cho FE (published):**

```sql
SELECT
  p.id,
  p.title,
  p.slug,
  p.excerpt,
  p.thumbnail_url,
  p.published_at,
  c.name AS category_name,
  c.slug AS category_slug
FROM blog_posts p
LEFT JOIN blog_categories c ON p.category_id = c.id
WHERE p.status = 'published'
  AND p.published_at IS NOT NULL
  AND p.published_at <= :now
  -- optional filter category
  AND (:category_slug IS NULL OR c.slug = :category_slug)
ORDER BY p.published_at DESC
LIMIT :limit OFFSET :offset;
```

**Lấy tags của 1 post:**

```sql
SELECT t.id, t.name, t.slug
FROM blog_post_tags pt
JOIN blog_tags t ON pt.tag_id = t.id
WHERE pt.post_id = :post_id;
```

**Lấy related posts (cùng category, khác id):**

```sql
SELECT
  p.id,
  p.title,
  p.slug,
  p.thumbnail_url,
  p.published_at
FROM blog_posts p
WHERE p.status = 'published'
  AND p.published_at <= :now
  AND p.category_id = :category_id
  AND p.id != :post_id
ORDER BY p.published_at DESC
LIMIT 3;
```
