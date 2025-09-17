import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Listing } from "../models/listing.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

const createListing = asyncHandler(async (req, res) => {
    const { itemName, description, price, category } = req.body;

    if ([itemName, description, price, category].some((field) => !field || (typeof field === 'string' && field.trim() === ""))) {
        throw new ApiError(400, "All fields are required");
    }

    const imageLocalPath = req.file?.path;
    if (!imageLocalPath) {
        throw new ApiError(400, "Image file is required");
    }

    const image = await uploadOnCloudinary(imageLocalPath);
    if (!image) {
        throw new ApiError(500, "Error while uploading image");
    }

    const listing = await Listing.create({
        itemName,
        description,
        price,
        imageUrl: image.url,
        category,
        owner: req.user?._id,
    });

    if (!listing) {
        throw new ApiError(500, "Something went wrong while creating the listing");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, listing, "Listing created successfully"));
});

const getAllListings = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, category } = req.query;
    
    const pipeline = [];
    const matchStage = {};

    if (query) {
        matchStage.$text = { $search: query };
    }
    if (category) {
        matchStage.category = category;
    }

    if (Object.keys(matchStage).length > 0) {
        pipeline.push({ $match: matchStage });
    }

    if (sortBy) {
        const sortOrder = sortType === 'desc' ? -1 : 1;
        pipeline.push({ $sort: { [sortBy]: sortOrder } });
    } else {
        pipeline.push({ $sort: { createdAt: -1 } });
    }

    const listingAggregate = Listing.aggregate(pipeline);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        populate: {
            path: "owner",
            select: "username fullName email phoneNumber hostelName hostelRoomNo"
        }
    };

    const listings = await Listing.aggregatePaginate(listingAggregate, options);

    if (!listings) {
        throw new ApiError(500, "Could not retrieve listings");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, listings, "Listings retrieved successfully"));
});

const getListingById = asyncHandler(async (req, res) => {
    const { listingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
        throw new ApiError(400, "Invalid listing ID");
    }

    const listing = await Listing.findById(listingId).populate(
        "owner",
        "fullName username email phoneNumber hostelName hostelRoomNo"
    );

    if (!listing) {
        throw new ApiError(404, "Listing not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, listing, "Listing retrieved successfully")
        );
});

const updateListing = asyncHandler(async (req, res) => {
    const { listingId } = req.params;
    const { itemName, description, price, category } = req.body;

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
        throw new ApiError(400, "Invalid listing ID");
    }
    
    const listing = await Listing.findById(listingId);

    if (!listing) {
        throw new ApiError(404, "Listing not found");
    }

    if (listing.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this listing");
    }

    const updatedListing = await Listing.findByIdAndUpdate(
        listingId,
        {
            $set: {
                itemName,
                description,
                price,
                category
            },
        },
        { new: true }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedListing,
                "Listing updated successfully"
            )
        );
});

const deleteListing = asyncHandler(async (req, res) => {
    const { listingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
        throw new ApiError(400, "Invalid listing ID");
    }

    const listing = await Listing.findById(listingId);

    if (!listing) {
        throw new ApiError(404, "Listing not found");
    }

    if (listing.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this listing");
    }

    if (listing.imageUrl) {
        await deleteFromCloudinary(listing.imageUrl);
    }

    await Listing.findByIdAndDelete(listingId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Listing deleted successfully"));
});

const getUserListings = asyncHandler(async (req, res) => {
    const listings = await Listing.find({ owner: req.user._id }).sort({ createdAt: -1 });

    if (!listings) {
        throw new ApiError(500, "Could not retrieve your listings");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, listings, "User listings retrieved successfully"));
});

export { 
    createListing,
    getAllListings,
    getListingById,
    updateListing,
    deleteListing,
    getUserListings
};