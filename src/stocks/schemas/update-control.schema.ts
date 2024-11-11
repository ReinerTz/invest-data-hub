// src/update-control/schemas/update-control.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UpdateControl extends Document {
  @Prop({ required: true })
  lastUpdate: Date;
}

export const UpdateControlSchema = SchemaFactory.createForClass(UpdateControl);
