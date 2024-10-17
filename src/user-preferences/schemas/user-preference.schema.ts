import { Category } from '@interfaces/category';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserPreferenceDocument = HydratedDocument<UserPreference>;

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
export class UserPreference {
    @Prop({required: true, unique: true})
    userId: string;

    @Prop({type: [Object], required: true})
    categories: Category[]
}

export const UserPreferenceSchema = SchemaFactory.createForClass(UserPreference);
