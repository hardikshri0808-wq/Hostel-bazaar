import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
    // If the error is an instance of our custom ApiError, use its properties
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            statusCode: err.statusCode,
            message: err.message,
            success: false,
            errors: err.errors,
        });
    }

    // For unexpected errors, send a generic 500 response
    // Also, log the error for debugging purposes
    console.error(err);
    return res.status(500).json({
        statusCode: 500,
        message: "Internal Server Error",
        success: false,
        errors: [],
    });
};

export { errorHandler };