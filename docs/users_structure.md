features/users/
├── services/
│ ├── user.service.ts # Profile operations
│ ├── notification.service.ts # Notification settings
│ ├── favorites.service.ts # Favorite genres
│ └── follows.service.ts # Follow management
├── hooks/queries/
│ ├── use-profile.query.ts
│ ├── use-notification-preferences.query.ts
│ └── use-following-stories.query.ts
├── hooks/mutations/
│ ├── use-update-profile.mutation.ts
│ ├── use-favorite-genres.mutation.ts
│ └── use-follow-story.mutation.ts
└── components/
├── ProfileEditor/
├── NotificationSettings/
├── FavoriteGenres/
└── FollowingStories/

### API Design với separation rõ ràng

### Backend structure

backend/src/
├── modules/
│ ├── users/ # Core user module
│ │ ├── controllers/
│ │ │ ├── profiles.controller.ts # Thay đổi users.controller.ts -> chuyên cho profile
│ │ │ └── user-preferences.controller.ts # Notification settings
│ │ ├── services/
│ │ │ ├── profiles.service.ts # Thay đổi users.service.ts
│ │ │ └── notification-preferences.service.ts
│ │ ├── dto/
│ │ │ ├── profile/ # Profile DTOs
│ │ │ │ ├── update-profile.dto.ts
│ │ │ │ └── profile-response.dto.ts
│ │ │ └── notifications/ # Notification DTOs
│ │ │ ├── update-notification-preferences.dto.ts
│ │ │ └── notification-preferences-response.dto.ts
│ │ └── entities/
│ │ ├── user.entity.ts # Core user info only
│ │ └── user-notification-preferences.entity.ts
│ ├── favorites/ # Mới: User favorites module
│ │ ├── controllers/
│ │ │ └── favorite-genres.controller.ts
│ │ ├── services/
│ │ │ └── favorite-genres.service.ts
│ │ ├── dto/
│ │ │ ├── favorite-genres-response.dto.ts
│ │ │ └── toggle-favorite.dto.ts
│ │ └── entities/
│ │ └── user-favorite-genre.entity.ts
│ ├── follows/ # Mới: Story following module  
│ │ ├── controllers/
│ │ │ └── story-follows.controller.ts
│ │ ├── services/
│ │ │ └── story-follows.service.ts
│ │ ├── dto/
│ │ │ ├── follow-story.dto.ts
│ │ │ └── following-stories.dto.ts
│ │ └── entities/
│ │ └── user-story-follow.entity.ts
│ ├── auth/
│ ├── genres/
│ └── media/
├── common/
│ ├── constants/
│ │ ├── timezone.constant.ts
│ │ └── multer.constants.ts # Mới: File upload config
│ ├── entities/
│ │ ├── base.entity.ts
│ │ └── uuid-base.entity.ts
│ └── decorators/
│ └── ... (existing decorators)
└── app.module.ts

### Route Mapping

PATCH /api/users/profile # Profile updates
GET /api/users/notification-preferences # Lấy cài đặt thông báo
PUT /api/users/notification-preferences # Cập nhật cài đặt thông báo

GET /api/users/favorite-genres # Lấy thể loại yêu thích
POST /api/users/favorite-genres # Thêm thể loại yêu thích
DELETE /api/users/favorite-genres/{id} # Xóa thể loại yêu thích

GET /api/users/following-stories # Lấy truyện theo dõi
POST /api/users/follow-stories/{id} # Theo dõi truyện
DELETE /api/users/follow-stories/{id} # Bỏ theo dõi

// user.module.ts
@Module({
imports: [
TypeOrmModule.forFeature([
User,
UserNotificationPreferences, // Import các entity con
UserFavoriteGenre,
UserStoryFollow,
])
]
})
