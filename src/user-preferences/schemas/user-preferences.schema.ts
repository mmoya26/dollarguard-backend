import { Category } from '@interfaces/category';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserPreferencesDocument = HydratedDocument<UserPreferences>;

@Schema({
    toJSON: {
        transform: (doc, ret) => {
            // Transform main document _id
            ret.id = ret._id.toString();
            delete ret._id;
            
            // Transform _id in each category
            if (ret.categories && Array.isArray(ret.categories)) {
                ret.categories = ret.categories.map(category => {
                    const transformed = { ...category };
                    if (transformed._id) {
                        transformed.id = transformed._id.toString();
                        delete transformed._id;
                    }
                    return transformed;
                });
            }
            
            return ret;
        },
    },
    versionKey: false
})
export class UserPreferences {
    @Prop({unique: true, required: true})
    userId: string

    @Prop({ type: [{ name: String, hexColor: String }], required: true })
    categories: Category[]
}

export const UserPreferencesSchema = SchemaFactory.createForClass(UserPreferences);
