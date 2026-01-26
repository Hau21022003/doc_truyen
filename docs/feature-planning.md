# 📚 Feature Planning - Web Đọc Truyện

## 🎯 Tổng quan

Dựa trên User entity với 3 roles (READER, CONTENT_ADMIN, SYSTEM_ADMIN), tài liệu này mô tả chi kế hoạch tính năng cho trang web đọc truyện.

---

## 👥 Reader (Người đọc)

### 🔍 Tính năng cốt lõi

#### 1. Khám phá truyện

- **Danh sách truyện**: Phân trang, sắp xếp (mới nhất, phổ biến, đánh giá)
- **Tìm kiếm**: Tìm theo tên truyện, tác giả, thể loại
- **Bộ lọc nâng cao**:
  - Thể loại (Action, Romance, Fantasy, etc.)
  - Trạng thái (Đang viết, Hoàn thành, Tạm ngưng)
  - Số chương (1-50, 50-100, 100+)
  - Đánh giá (4+sao, 3+sao, etc.)

#### 2. Đọc truyện

- **Reading Interface**:
  - Font size adjustment
  - Dark/Light mode toggle
  - Reading width adjustment
  - Line height control
  - Background color themes
- **Reading Progress**:
  - Auto-save reading position
  - Resume reading from last position
  - Track reading time
  - Reading statistics

#### 3. Theo dõi & Tương tác

- **Bookmark**: Đánh dấu chương yêu thích
- **Follow**: Theo dõi truyện để nhận thông báo
- **Reading Lists**: Tạo danh sách cá nhân
  - "Đọc sau" (To Read)
  - "Yêu thích" (Favorites)
  - "Đang đọc" (Currently Reading)
- **History**: Lịch sử đọc gần đây

#### 4. Đánh giá & Bình luận

- **Rating**: Đánh giá 1-5 sao cho truyện
- **Reviews**: Viết bài đánh giá chi tiết
- **Comments**: Bình luận từng chương
- **Like/Dislike**: Thích/không thích bình luận

### 🚀 Tính năng nâng cao

#### 1. Cá nhân hóa

- **Recommendations**: Gợi ý truyện dựa trên lịch sử đọc
- **Similar Stories**: Truyện tương tự dựa trên thể loại và rating
- **Author Suggestions**: Gợi ý tác giả tương tự
- **Trending**: Các truyện thịnh hành theo thể loại

#### 2. Social Features

- **Follow Readers**: Theo dõi người đọc khác
- **Share Reading**: Chia sẻ đang đọc truyện gì
- **Reading Groups**: Tham gia nhóm đọc truyện
- **Reading Challenges**: Thử thách đọc sách

#### 3. Reading Analytics

- **Personal Dashboard**:
  - Tổng số chapter đã đọc
  - Thời gian đọc trung bình
  - Thể loại ưa thích
  - Mức độ hoàn thành truyện
- **Reading Goals**: Đặt mục tiêu đọc hàng tháng
- **Achievements**: Huy hiệu thành tích đọc sách

---

## 📝 Content Admin (Quản lý nội dung)

### 📚 Quản lý Truyện

#### 1. Story Management

- **CRUD Operations**:
  - Create story với đầy đủ thông tin
  - Edit thông tin truyện (title, description, cover image)
  - Delete/Xóa mềm truyện
  - Bulk operations (thêm nhiều truyện cùng lúc)
- **Story Information**:
  - Title, description, author, cover image
  - Genres, tags, publication date
  - Status (ongoing, completed, hiatus, dropped)
  - Rating distribution
  - View count, follow count
- **Import/Export**:
  - Import từ file (CSV, JSON, API)
  - Export data để backup

#### 2. Chapter Management

- **Chapter Operations**:
  - Add, edit, delete chapters
  - Chapter numbering và ordering
  - Bulk chapter upload
  - Chapter scheduling (đặt lịch đăng)
- **Chapter Content**:
  - Rich text editor
  - Word count
  - Reading time estimation
  - Chapter status (draft, published, scheduled)
- **Chapter Analytics**:
  - Views per chapter
  - Average reading time
  - Drop-off points

#### 3. Category & Genre Management

- **Genre CRUD**: Thêm, sửa, xóa thể loại
- **Genre Hierarchy**: Thể loại cha/con
- **Tag Management**:
  - Create custom tags
  - Tag popularity
  - Tag suggestions

#### 4. Author Management

- **Author Profile**:
  - Basic information
  - Biography
  - Social media links
  - Photo/avatar
- **Author Works**:
  - List of stories
  - Total views
  - Average rating
  - Followers count

### 📊 Analytics & Reporting

#### 1. Content Analytics

- **Popular Stories**: Top viewed, top rated
- **Reading Trends**: Xem тенд theo thời gian
- **Genre Performance**: Thể loại phổ biến
- **Author Performance**: Tác giả nổi bật
- **Chapter Performance**:
  - Most read chapters
  - Average completion rate
  - Reading time analytics

#### 2. User Engagement

- **Reader Demographics**: Thống kê độc giả
- **Reading Behavior**:
  - Average reading session time
  - Peak reading hours
  - Device usage statistics
- **Social Metrics**:
  - Comments per chapter
  - Rating distribution
  - Share statistics

### 🔒 Moderation Tools

#### 1. Content Moderation

- **Content Review Queue**:
  - User-submitted stories
  - Reported content
  - Auto-flagged content
- **Moderation Actions**:
  - Approve/reject content
  - Request edits
  - Apply content warnings
  - Remove inappropriate content

#### 2. Comment Moderation

- **Comment Review**: Xem và duyệt bình luận
- **Auto Moderation**: Filter từ khóa, spam detection
- **User Warnings**: Cảnh báo vi phạm
- **Comment Management**: Xóa/báo cáo bình luận

#### 3. User Management (Content Level)

- **Reader Management**:
  - View user profiles
  - Check reading history
  - Apply temporary bans
  - Send warnings
- **Contributor Management**:
  - Manage user-generated content
  - Approve/reject contributor applications
  - Content permissions

---

## 🛠️ System Admin (Quản trị hệ thống)

### 🏠 Dashboard & Overview

#### 1. System Dashboard

- **Key Metrics**:
  - Total users (by role)
  - Active sessions
  - Server performance
  - Database usage
- **Real-time Statistics**:
  - Current online users
  - Recent activities
  - System alerts
- **Quick Actions**:
  - System maintenance toggle
  - Cache flush
  - Database backup trigger

#### 2. User Management

- **User Overview**:
  - List all users with filtering/search
  - User role management
  - Account status (active, inactive, suspended)
- **User Operations**:
  - Create/edit/delete users
  - Bulk user operations
  - Password reset
  - Login history
- **User Analytics**:
  - Registration trends
  - Active user statistics
  - Geographic distribution
  - Device usage patterns

### ⚙️ System Configuration

#### 1. Application Settings

- **General Settings**:
  - Site title, description
  - Contact information
  - Social media links
  - Maintenance mode
- **Performance Settings**:
  - Cache configuration
  - Pagination limits
  - Rate limiting
  - CDN settings
- **Security Settings**:
  - JWT configuration
  - Password policies
  - Session timeout
  - IP restrictions

#### 2. Content Configuration

- **File Upload Settings**:
  - Maximum file sizes
  - Allowed file types
  - Image compression
  - Storage location
- **Content Limits**:
  - Maximum story titles
  - Chapter length limits
  - Daily posting limits
- **Content Moderation**:
  - Auto-moderation rules
  - Keyword filters
  - Spam protection level

### 🔧 System Maintenance

#### 1. Database Management

- **Backup & Restore**:
  - Automated backup schedules
  - Manual backup triggers
  - Restore points management
  - Data export/import
- **Database Optimization**:
  - Query performance analysis
  - Index management
  - Cache warming
  - Database cleanup

#### 2. Storage Management

- **File Storage**:
  - Storage usage monitoring
  - Cleanup orphaned files
  - Archive old content
  - Storage location management
- **Backup Management**:
  - Automated backup schedules
  - Backup retention policies
  - Restore procedures

### 📈 Advanced Monitoring

#### 1. Performance Monitoring

- **System Metrics**:
  - CPU usage
  - Memory consumption
  - Disk I/O
  - Network traffic
- **Application Metrics**:
  - Response times
  - Error rates
  - Database performance
  - Cache hit ratios

#### 2. Security Monitoring

- **Access Control**:
  - Failed login attempts
  - IP blocking
  - Role-based access logs
  - Permission changes
- **Threat Detection**:
  - Suspicious activities
  - Rate limiting violations
  - Content violations

#### 3. Business Analytics

- **User Analytics**:
  - User acquisition
  - Retention rates
  - LTV (Lifetime Value)
  - Churn analysis
- **Content Analytics**:
  - Content performance
  - Revenue analysis (if premium)
  - Engagement metrics

---

## 🗂️ Database Schema Suggestions

### Core Tables

#### Users (đã có)

- id, email, password, username, firstName, lastName, avatar, isActive, role, lastLoginAt

#### Stories

- id, title, description, coverImage, authorId, status, isPublished, createdAt, updatedAt

#### Chapters

- id, storyId, title, content, orderNumber, wordCount, isPublished, publishedAt

#### Genres

- id, name, description, parentId

#### StoryGenres

- storyId, genreId

#### ReadingProgress

- id, userId, storyId, chapterId, position, lastReadAt

#### Reviews

- id, userId, storyId, rating, comment, createdAt

#### Comments

- id, userId, chapterId, content, parentId, createdAt

---

## 🔐 Security Considerations

### Authentication & Authorization

- JWT tokens with refresh mechanism
- Role-based access control (RBAC)
- API rate limiting
- Input validation and sanitization

### Data Protection

- Password hashing (bcrypt)
- PII encryption
- GDPR compliance
- Audit trails for admin actions

---

## 🚀 Implementation Priorities

### Phase 1: MVP (Minimum Viable Product)

**Reader Features:**

- Basic story browsing and reading
- User registration/authentication
- Reading progress tracking

**Content Admin Features:**

- Basic story/chapter CRUD
- Genre management

**System Admin Features:**

- User management
- Basic dashboard

### Phase 2: Enhanced Experience

**Reader Features:**

- Ratings and reviews
- Advanced search and filtering
- Reading lists

**Content Admin Features:**

- Content analytics
- Moderation tools

**System Admin Features:**

- Advanced monitoring
- System configuration

### Phase 3: Advanced Features

**Reader Features:**

- Personal recommendations
- Social features
- Mobile app

**Content Admin Features:**

- AI-powered content analysis
- Advanced analytics

**System Admin Features:**

- Automation tools
- Advanced security features

---

## 📋 API Endpoint Structure Suggestion

### Reader Endpoints

- `GET /stories` - List stories with pagination
- `GET /stories/:id` - Get story details
- `GET /stories/:id/chapters` - List story chapters
- `GET /chapters/:id` - Get chapter content
- `POST /reading-progress` - Save reading progress
- `GET /reading-progress/:storyId` - Get reading progress

### Content Admin Endpoints

- `POST /admin/stories` - Create story
- `PUT /admin/stories/:id` - Update story
- `POST /admin/chapters` - Create chapter
- `PUT /admin/chapters/:id` - Update chapter
- `GET /admin/analytics` - Get content analytics

### System Admin Endpoints

- `GET /admin/users` - List users
- `PUT /admin/users/:id` - Update user
- `GET /admin/system/health` - System health check
- `POST /admin/system/backup` - Trigger backup

---

_Last Updated: January 21, 2026_
