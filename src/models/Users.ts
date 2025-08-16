import mongoose, { Schema } from 'mongoose';

const UsersSchema = new mongoose.Schema(
  {
    user_address: { type: String, required: true, unique: true },
    user_email: { type: String },
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.models.Users || mongoose.model('Users', UsersSchema);
export default Users;
