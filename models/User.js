const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const md5 = require("md5");
const validator = require("validator");
const mongoDbErrorHandler = require("mongoose-mongodb-errors");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
	email: {
		type: String,
		unique: true,
		lowercase: true,
		trim: true,
		validate: [validator.isEmail, "Invalid Email Address"],
		required: "Please supply an email address"
	},
	name: {
		type: String,
		required: "Please supply a name",
		trim: true
	},
	resetPasswordToken: String,
	resetPasswordExpires: Date
});

userSchema.virtual("gravatar").get(function() {
	// return `http://www.joy.land/dist/assets/img/games/og-image/game-7.png`;
	const hash = md5(this.email);
	return `https://gravatar.com/avatar/${hash}?s=200`;
});

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
userSchema.plugin(mongoDbErrorHandler);

module.exports = mongoose.model("User", userSchema);
