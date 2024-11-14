import { User } from "../models/user.model.js"
import { Message } from "../models/message.model.js"

export const getAllUsers = async (req, res, next) => {
    try {
        const currentUser = req.auth.userId
        const users = await User.find({clerkId: {$ne: currentUser}})
        res.status(200).json(users)
    } catch (error) {
        console.log("Error getting all users", error)
        next(error)
    }
}

export const getMessages = async (req, res, next) => {
    try {
        const myId = req.auth.userId
        const {userId} = req.params
        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: userId},
                {senderId: userId, receiverId: myId}
            ]
        }).sort({createdAt: 1})
        res.status(200).json(messages)
    } catch (error) {
        next(error)
    }
}