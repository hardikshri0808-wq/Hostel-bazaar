import { Router } from "express";
import {
    createListing,
    getAllListings,
    getListingById,
    updateListing,
    deleteListing,
    getUserListings
} from "../controllers/listing.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// --- Public Routes ---
router.route("/").get(getAllListings);

// --- Protected Routes (must come before dynamic :listingId route) ---
router.route("/create").post(verifyJWT, upload.single("listingImage"), createListing);
router.route("/my-listings").get(verifyJWT, getUserListings);

// --- Routes for a specific listing by ID (must be last) ---
router
    .route("/:listingId")
    .get(getListingById)
    .patch(verifyJWT, updateListing)
    .delete(verifyJWT, deleteListing);

export default router;