// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UsersSchema } from './schemas/user.schema';
import { UsersService } from './users.service';

@Module({
  imports: [
    // MongooseModule.forFeature([{ name: 'users', schema: UsersSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }]),
  ],

  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
