import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserPreferences } from 'src/user-preferences/schemas/user-preferences.schema';

export type UserDocumenbt = HydratedDocument<User>;

@Schema({
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            delete ret.password;
            return ret;
        },
    },
})
export class User {
    @Prop({required: true})
    name: string;

    @Prop({required: true, unique: true})
    email: string;

    @Prop({unique: true})
    lowerCaseEmail: string;

    @Prop({required: true}) 
    password: string;

    @Prop({required: true})
    creationDate: Date;

    @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'UserPreferences'})
    preferences: UserPreferences
}

export const UserSchema = SchemaFactory.createForClass(User);