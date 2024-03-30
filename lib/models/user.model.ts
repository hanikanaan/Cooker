import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    id: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    image: String,
    bio: String,
    posts: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    onboarded: {
        type: Boolean,
        default: false,
    },
    interests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Interest'
        }
    ]
})

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;