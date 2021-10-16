const mongoose  = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
    {
      fullName: { type: String, required:true },
      email: { type: String, required: true, unique: true, trim: true },
      password: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
    {
      timestamps: true,
    }
  );

  UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(5);
    return await bcrypt.hash(password, salt);
  };
  
  UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

module.exports  = mongoose.model('users', UserSchema);