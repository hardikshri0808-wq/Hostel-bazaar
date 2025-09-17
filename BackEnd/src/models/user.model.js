import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        match: [/^[0-9]{10}$/, 'Please fill a valid 10-digit phone number']
    },
    hostelName: {
        type: String,
        required: true,
        trim: true
    },
    hostelRoomNo: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken:{
        type:String
    },
    wishlist: [
        {
            type: Schema.Types.ObjectId,
            ref: "Listing"
        }
    ]
},{timestamps:true});

userSchema.pre("save",async  function(next) {
    if(!this.isModified("password")) return next();
    
    this.password=await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User=mongoose.model("User",userSchema)