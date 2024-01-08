import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [UserModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

/* SignUp
    1. Validate input
    2. Check email duplication
    3. Hash the password
    4. store user information in database
 */

// signin
// me
