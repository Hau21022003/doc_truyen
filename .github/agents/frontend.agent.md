# Frontend Agent Configuration

## Directory Structure

### Cấu trúc thư mục đề xuất với Next.js App Router + Zod + Zustand + TanStack Query:

```
src/
  app/                    // Next.js App Router
    globals.css
    layout.tsx
    page.tsx

    auth/
      login/
        page.tsx
      register/
        page.tsx

    comics/
      page.tsx
      [id]/
        page.tsx
        reading/
          page.tsx

    genres/
      page.tsx
      [slug]/
        page.tsx

    profile/
      page.tsx

  features/              // Logic theo feature
    auth/
      components/
        LoginForm.tsx
        RegisterForm.tsx
      hooks/
        useAuth.ts
      stores/            // Zustand stores
        authStore.ts
      services/          // API calls only
        authService.ts
      queries/           // TanStack Query - uses services
        authQueries.ts
      schemas/           // Zod validation
        auth.schema.ts
      types/
        auth.types.ts

    comics/
      components/
        ComicCard.tsx
        ComicList.tsx
        ComicDetail.tsx
        ComicReader.tsx
      hooks/
        useComics.ts
        useComicReader.ts
      stores/
        comicsStore.ts
        readerStore.ts
      services/          // API calls only
        comicService.ts
        chapterService.ts
      queries/           // TanStack Query - uses services
        comicQueries.ts
        chapterQueries.ts
      schemas/
        comic.schema.ts
        chapter.schema.ts
      types/
        comic.types.ts

    genres/
      components/
        GenreList.tsx
        GenreFilter.tsx
        GenreBadge.tsx
      hooks/
        useGenres.ts
      stores/
        genresStore.ts
      services/          // API calls only
        genreService.ts
      queries/           // TanStack Query - uses services
        genreQueries.ts
      schemas/
        genre.schema.ts
      types/
        genre.types.ts

    profile/
      components/
        ProfileInfo.tsx
        ProfileSettings.tsx
        AvatarUpload.tsx
      hooks/
        useProfile.ts
      stores/
        profileStore.ts
      services/          // API calls only
        profileService.ts
      queries/           // TanStack Query - uses services
        profileQueries.ts
      schemas/
        profile.schema.ts
      types/
        profile.types.ts

  components/           // TẤT CẢ components (shadcn/ui + custom)
    ui/                 // shadcn/ui components (CLI quản lý)
      button.tsx
      input.tsx
      dropdown-menu.tsx
      dialog.tsx
      form.tsx

    // TÂM THÔI CÁC COMPONENTS DÙNG CHUNG
    Header.tsx          // Header cho trang web
    Footer.tsx          // Footer cho trang web
    ErrorBoundary.tsx   // Error handling
    Loading.tsx         // Loading spinner/UI
    SearchInput.tsx

  shared/               // Logic dùng chung
    hooks/
      useLocalStorage.ts
      useDebounce.ts
      useApi.ts
    stores/
      themeStore.ts
      uiStore.ts
    services/
      queryClient.ts    // TanStack Query config
      apiClient.ts      // API client config
    schemas/            // Zod schemas dùng chung
      common.schema.ts
      api.schema.ts
    types/
      common.types.ts
      api.types.ts
    providers/
      QueryProvider.tsx
      ZustandProvider.tsx
      I18nProvider.tsx

  i18n
    locales/
      en/
      vi/
    config.ts
    navigation.ts

  lib/                  // Third-party và config
    validations/        // Zod validation helpers
      validate.ts
      parseSchema.ts
    stores/
      storeUtils.ts     // Zustand utilities
    queries/
      queryHelpers.ts   // TanStack Query helpers
    api/
      apiUtils.ts
      endpoints.ts
```

### Quy tắc tổ chức:

1. **Routes trong `app`**: Chỉ chứa `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
2. **Logic trong `features`**: Components, hooks, stores, services, schemas, types cho từng feature
3. **Chia sẻ trong `shared`**: Components và logic có thể tái sử dụng across features
4. **Config trong `lib`**: Các file config và third-party integrations

### Integration Flow:

- **Zod**: Validation schemas → Components → Form validation
- **Zustand**: State stores → Components → Global state management
- **Services**: API calls → Pure HTTP requests with error handling
- **TanStack Queries**: Use services → Data fetching → Hooks → Component state

<ThemeProvider>
          <QueryProvider>
            <ZustandProvider>
              {children}
            </ZustandProvider>
          </QueryProvider>
        </ThemeProvider>

// components/ui/button.tsx
import { cva, type VariantProps } from "class-variance-authority";
