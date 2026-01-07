import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AppConfigModule } from 'src/config/app-config.module';
import jwtConfig from 'src/config/jwt.config';
import databaseConfig from 'src/config/database.config';
import { UsersModule } from 'src/apis/users/users.module';
import { GenresModule } from './apis/genres/genres.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from './config/app-config.service';
import { ValidationProvidersModule } from './common/providers/validation-providers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, databaseConfig],
      // envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
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
        synchronize: config.dbSynchronize,
        logging: config.dbLogging,
      }),
    }),
    AppConfigModule,
    UsersModule,
    GenresModule,
    ValidationProvidersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
