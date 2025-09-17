import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    toggleWishlistStatus,
    getWishlistedListings,
    getUserProfile
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"; 

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/profile/:username").get(getUserProfile);
// Secured Route
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/wishlist").get(verifyJWT, getWishlistedListings);
router.route("/wishlist/:listingId").patch(verifyJWT, toggleWishlistStatus);

export default router;