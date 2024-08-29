const { model, models, Schema } = require("mongoose");

const adminSchema = new Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		phone: String,
		image: { type: String, default: "https://randomuser.me/api/portraits/lego/5.jpg" },
		imageKey: String,
		isBan: { type: Boolean, default: false },
		user_type: { type: String, default: "admin" },
	},
	{ timestamps: true }
);

const Admin = models.Admin || model("Admin", adminSchema);

module.exports = Admin;
