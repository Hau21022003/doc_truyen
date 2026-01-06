import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AppConfigModule } from 'src/config/app-config.module';
import jwtConfig from 'src/config/jwt.config';
import databaseConfig from 'src/config/database.config';
import { UsersModule } from 'src/apis/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, databaseConfig],
      // envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    AppConfigModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
