import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const listingSchema = new Schema(
    {
        itemName: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        imageUrl: {
            type: String, // We'll store the Cloudinary URL here
            required: true,
        },
        category: {
            type: String,
            required: true,
            enum: ["Books", "Electronics", "Stationery", "Services", "Other"],
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User", // Creates a direct link to the User model
        },
    },
    {
        timestamps: true
    }
);

listingSchema.index({ itemName: "text", description: "text" });
listingSchema.plugin(mongooseAggregatePaginate);
export const Listing = mongoose.model("Listing", listingSchema);