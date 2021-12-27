const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = mongoose.Schema(
  {
    name: {
      type: String,
      required: 'true',
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      default: 'https://img.icons8.com/ios-glyphs/50/000000/user--v1.png',
    },
  },
  {
    timestamps: true,
  }
);

User.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

User.pre('save', async function (next) {
  if (!this.isModified) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', User);
