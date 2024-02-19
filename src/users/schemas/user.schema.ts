// src/user/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { PREFIX } from 'src/utils/prefix.constants';

export type UserDocument = Document & {
  id: string;
  username: string;
  password: string;
};

@Schema({ timestamps: true })
export class User {
  @Prop({ required: false, unique: true })
  id: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;
}

export const UsersSchema = SchemaFactory.createForClass(User);

UsersSchema.pre<User & Document>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  if (this.isNew) {
    this.id = `${PREFIX.USER}_${this._id.toString()}`;
  }
  next();
});
