import { Category } from '@interfaces/category';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserPreferencesDocument = HydratedDocument<UserPreferences>;

@Schema({
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
    versionKey: false
})
export class UserPreferences {
    @Prop({type: [Object], required: true})
    categories: Category[]
}

export const UserPreferencesSchema = SchemaFactory.createForClass(UserPreferences);
