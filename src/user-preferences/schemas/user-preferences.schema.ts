import { Category } from '@interfaces/category';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserPreferencesDocument = HydratedDocument<UserPreferences>;

@Schema({ versionKey: false })
export class UserPreferences {
    @Prop({unique: true, required: true})
    userId: string

    @Prop({ type: [{ name: String, hexColor: String }], required: true })
    categories: Category[]
}

export const UserPreferencesSchema = SchemaFactory.createForClass(UserPreferences);
