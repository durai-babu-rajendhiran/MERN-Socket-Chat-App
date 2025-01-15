const { ChatCode } = require('../Utils/ChatCode')
const UserConnect = require('../model/UserConnect');
const responseHandlier = require("../Utils/Response")
const mongoose = require('mongoose');
exports.AddUserConnect = async (req, res) => {
    try {
        const sender = req.user.id
        const receiver = req.params.id
        if (!sender || !receiver) {
            res.status(400).json({ message: 'Send sender and receiver ID', status: true, data: {} });
            return
        }
        if (sender == receiver) {
            res.status(400).json({ message: 'User ID Should be different ', status: false, });
            return
        }
        var alreadyExists = await UserConnect.findOne({
            $or: [
                { $and: [{ sender: sender }, { receiver: receiver }] },
                { $and: [{ sender: receiver }, { receiver: sender }] }
            ]
        }).exec();
        if (alreadyExists) {
            res.json({ message: 'UserConnect Already stored successfully', status: true, data: alreadyExists });
            return
        }
        var nodeName = ChatCode()
        const newUserConnect = new UserConnect({
            sender: sender,
            receiver: receiver,
            nodeId: nodeName
        });
        await newUserConnect.save();
        res.json({ message: 'UserConnect stored successfully', status: true, data: newUserConnect });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', err });
    }
};
exports.DeleteUserConnect = async (req, res) => {
    try {
        const item = await UserConnect.findById(req.params.itemId);
        if (!item) {
            return res.status(404).json({ message: 'UserConnect not found' });
        }
        await UserConnect.findByIdAndDelete(req.params.itemId);
        res.json({ message: 'UserConnect deleted successfully', status: true });
    } catch (err) {
        return responseHandlier.errorResponse(false, err.message, res);
    }
};
exports.UserConnectList = async (req, res) => {
    var user_id = new mongoose.Types.ObjectId(req.user.id);  // Convert string to ObjectId
    const chatlistPipeline = [
        {
            $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "senderDetails"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "receiver",
                foreignField: "_id",
                as: "receiveDetails"
            }
        },
        {
            $addFields: {
                matchedField: {
                    $cond: {
                        if: { $eq: ["$sender", user_id] },
                        then: "senderData",
                        else: "receiverData"
                    }
                }
            }
        },
        {
            $unwind: { path: "$senderDetails", preserveNullAndEmptyArrays: true }  // Adjust unwind
        },
        {
            $unwind: { path: "$receiveDetails", preserveNullAndEmptyArrays: true }  // Adjust unwind
        },
        {
            $match: {
                $or: [
                    { sender: user_id },
                    { receiver: user_id }
                ]
            }
        },
        {
            $project: {
                _id: 1,
                sender: 1,
                receiver: 1,
                nodeId: 1,
                status: 1,
                senderDetails: 1,
                matchedField: 1,
                receiveDetails: 1,
            }
        }
    ];
    try {
        const dataList = await UserConnect.aggregate(chatlistPipeline).exec();
        const matchedData = dataList.map(item => {
            if (item.matchedField == "senderData") {
                return {
                    userData: item.receiveDetails,
                    nodeId: item.nodeId
                };
            } else {
                return {
                    userData: item.senderDetails,
                    nodeId: item.nodeId
                };
            }
        });
        res.json({ data: matchedData });
    } catch (error) {
        console.error(error);  // Log error for debugging
        res.status(500).json({ error: 'Internal server error' });
    }
};
