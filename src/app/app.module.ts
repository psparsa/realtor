import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { HomeModule } from './home/home.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserInterceptor } from 'src/app/user/user.interceptor';
import * as path from 'path';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
} from 'nestjs-i18n';

const i18nModule = I18nModule.forRoot({
  fallbackLanguage: 'en',
  loaderOptions: {
    path: path.join(__dirname, '../i18n/locales/'),
    watch: true,
  },

  resolvers: [
    AcceptLanguageResolver,
    new HeaderResolver(['x-accept-language']),
  ],
  typesOutputPath: path.join(__dirname, '../../src/i18n/i18n.generated.ts'),
});

@Module({
  imports: [i18nModule, UserModule, PrismaModule, HomeModule],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
  ],
})
export class AppModule {}
