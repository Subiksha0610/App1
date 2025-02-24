// This is a placeholder for a future Mongoose model
class User {
    constructor(_id, name, email, phoneNumber, profilePhoto, referralCode, createdAt) {
      this._id = _id;
      this.name = name;
      this.email = email;
      this.phoneNumber = phoneNumber;
      this.profilePhoto = profilePhoto;
      this.referralCode = referralCode;
      this.createdAt = createdAt;
    }
  }
  
  module.exports = User;
  