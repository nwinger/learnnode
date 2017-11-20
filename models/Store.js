const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const slug = require("slugs");

const storeSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: "Please enter a store name!"
	},
	slug: String,
	description: {
		type: String,
		trim: true
	},
	tags: [String],
	created: {
		type: Date,
		default: Date.now
	},
	location: {
		type: {
			type: String,
			default: "Point"
		},
		coordinates: [
			{
				type: Number,
				required: "You must supply coordinates!"
			}
		],
		address: {
			type: String,
			required: "You must supply an address!"
		}
	},
	photo: String
});

storeSchema.pre("save", async function(next) {
	if (!this.isModified("name")) {
		next(); // Skip it
		return; // Stop this function from running
		// TODO: make more resiliant so slugs are unique
	}
	this.slug = slug(this.name);

	// find other stores that have a similar slug of wes, wes-1, wes-2
	const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, "i");
	const storesWithSlugs = await this.constructor.find({ slug: slugRegEx });
	if (storesWithSlugs.length) {
		this.slug = `${this.slug}-${storesWithSlugs.length + 1}`;
	}

	next();
});

module.exports = mongoose.model("Store", storeSchema);
