import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Listing } from "../models/listing.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
    }
};

const registerUser = asyncHandler(async (req, res) => {
    // 1. Get user details from request body
    const { fullName, email, username, password, phoneNumber, hostelName, hostelRoomNo } = req.body;

    if ([fullName, email, username, password, phoneNumber, hostelName, hostelRoomNo].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }, { phoneNumber }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with email, username, or phone number already exists");
    }

    const user = await User.create({
        fullName,
        email,
        username: username.toLowerCase(),
        password,
        phoneNumber,
        hostelName,
        hostelRoomNo
    });

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    // 6. Find the created user and remove password and refreshToken from the response
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // 7. Send tokens to the user (refresh token in a secure cookie, access token in the response)
    const options = {
        httpOnly: true, // Prevents client-side JS from reading the cookie
        secure: true // Ensures the cookie is sent over HTTPS
    };

    return res
        .status(201)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                201, 
                { user: createdUser, accessToken }, 
                "User registered successfully"
            )
        );
});

const loginUser=asyncHandler(async (req,res)=>{
    const { email, username, password } = req.body;

    // 2. Validate that either username/email and password are provided
    if (!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    // 3. Find the user in the database
    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // 4. Verify the password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials"); // 401: Unauthorized
    }

    // 5. Generate new access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options) // ADD THIS LINE
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken }, // We can still send it in the body for convenience
                "User logged in successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { $set: { refreshToken: undefined } },
        { new: true }
    );
    
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };

    return res
        .status(200)
        .clearCookie("accessToken", options) // ADD THIS LINE
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    // 1. Get the refresh token from the user's cookies
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request: No refresh token");
    }

    try {
        // 2. Verify the token
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        // 3. Find the user in the database
        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        // 4. Security Check: Ensure the incoming token matches the one in our DB
        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        // 5. Generate new tokens (token rotation)
        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

        // 6. Send the new tokens back to the user
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

const toggleWishlistStatus = asyncHandler(async (req, res) => {
    const { listingId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
        throw new ApiError(400, "Invalid listing ID");
    }

    const user = await User.findById(userId);
    const isWishlisted = user.wishlist.includes(listingId);

    let updatedUser;
    let message = "";

    if (isWishlisted) {
        // If already in wishlist, remove it using $pull
        updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { wishlist: listingId } },
            { new: true }
        );
        message = "Removed from wishlist";
    } else {
        // If not in wishlist, add it using $addToSet
        updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { wishlist: listingId } },
            { new: true }
        );
        message = "Added to wishlist";
    }

    if (!updatedUser) {
        throw new ApiError(500, "Could not update wishlist");
    }

    return res.status(200).json(new ApiResponse(200, { wishlist: updatedUser.wishlist }, message));
});

const getWishlistedListings = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate({
        path: 'wishlist',
        populate: {
            path: 'owner',
            select: 'fullName username'
        }
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, user.wishlist, "Wishlist retrieved successfully"));
});

const getUserProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!username?.trim()) {
        throw new ApiError(400, "Username is missing");
    }

    // 1. Find the user by username
    const user = await User.findOne({ username: username.toLowerCase() }).select(
        "-password -refreshToken -wishlist" // Exclude sensitive fields
    );

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // 2. Find all listings owned by this user
    const listings = await Listing.find({ owner: user._id }).sort({ createdAt: -1 });

    // 3. Combine the user profile and their listings into one response
    const userProfile = {
        ...user.toObject(),
        listings: listings
    };

    return res
        .status(200)
        .json(new ApiResponse(200, userProfile, "User profile retrieved successfully"));
});

export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    toggleWishlistStatus, 
    getWishlistedListings,
    getUserProfile
};