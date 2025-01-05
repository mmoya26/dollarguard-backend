import { Category } from '@interfaces/category';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserPreferencesDocument = HydratedDocument<UserPreferences>;

export const defaultCategories: Category[] = [
  {
    name: "Miscellaneous",
    hexColor: "#475569",
  },
  {
    name: "Gas",
    hexColor: "#DC2626",
  },
  {
    name: "Utilities",
    hexColor: "#0891B2",
  },
  {
    name: "Groceries",
    hexColor: "#D97706",
  },
  {
    name: "Phone Bill",
    hexColor: "#4F46E5",
  }
]

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
    @Prop({ unique: true, required: true })
    userId: string

    @Prop({ type: [{ name: String, hexColor: String }], required: true, default: defaultCategories })
    categories: Category[]

    @Prop({ type: Map, of: { type: Map, of: Number }, default: null})
    budgets: Map<string, Map<string, number>>;

    @Prop({type: [String], default: []})
    activeYears: string[];
}

export const UserPreferencesSchema = SchemaFactory.createForClass(UserPreferences);
