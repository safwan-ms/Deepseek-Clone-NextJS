import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    _id: { 
      type: String, 
      required: true,
      unique: true 
    },
    name: { 
      type: String, 
      required: true,
      trim: true,
      minlength: 1
    },
    email: { 
      type: String, 
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    image: { 
      type: String,
      default: ""
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { 
    timestamps: true,
    // Ensure _id is not automatically generated
    _id: false
  }
);

// Add indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ _id: 1 });

// Pre-save middleware to update the updatedAt field
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
