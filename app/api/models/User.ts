import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  name: { type: String },
  age: { type: Number },
  course: { type: String },
  college: { type: String },
});

const User = models.User || model('User', UserSchema);

export default User; 