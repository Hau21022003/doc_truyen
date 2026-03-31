import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/config/app-config.module';
import databaseConfig from 'src/config/database.config';
import jwtConfig from 'src/config/jwt.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExcelModule } from './common/excel/excel.module';
import { ValidationProvidersModule } from './common/providers/validation-providers.module';
import { AppConfigService } from './config/app-config.service';
import appConfig from './config/app.config';
import cloudinaryConfig from './config/cloudinary.config';
import oauthConfig from './config/oauth.config';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard, RolesGuard } from './modules/auth/guards';
import { BookmarkModule } from './modules/bookmark/bookmark.module';
import { ChapterModule } from './modules/chapter/chapter.module';
import { MediaModule } from './modules/media/media.module';
import { ReadingHistoryModule } from './modules/reading-history/reading-history.module';
import { StoryInteractionsModule } from './modules/story-interactions/story-interactions.module';
import { StoryViewDailyModule } from './modules/story-view-daily/story-view-daily.module';
import { StoryModule } from './modules/story/story.module';
import { TagsModule } from './modules/tags/tags.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        jwtConfig,
        databaseConfig,
        oauthConfig,
        cloudinaryConfig,
      ],
    }),
    TypeOrmModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        type: 'postgres',
        host: config.dbHost,
        port: config.dbPort,
        username: config.dbUser,
        password: config.dbPassword,
        database: config.dbName,
        autoLoadEntities: true,
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        synchronize: config.dbSynchronize,
        logging: config.dbLogging,
        extra: {
          options: '-c timezone=UTC',
        },
      }),
    }),
    AppConfigModule,
    UsersModule,
    TagsModule,
    ValidationProvidersModule,
    AuthModule,
    MediaModule,
    StoryModule,
    ChapterModule,
    StoryInteractionsModule,
    BookmarkModule,
    ReadingHistoryModule,
    StoryViewDailyModule,
    ExcelModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
