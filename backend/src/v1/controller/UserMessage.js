const Message = require("../model/Message");
const responseHandlier = require('../Utils/Response');
const mongoose = require('mongoose');

exports.addMessage = async (req, res, next) => {
  try {
    const MessageData = req.body;
    MessageData.senderId = req.user.id;
    MessageData.userId = req.user.id;
    const newMessage = new Message(MessageData);
    await newMessage.save();
    return responseHandlier.successResponse(true, newMessage, res);
  } catch (err) {
    return responseHandlier.errorResponse(false, err, res);
  }
};

exports.ListMessage = async (req, res) => {
  try {
    const nodeId = req.params.id
    if (!nodeId) {
      return res.status(400).json({ message: 'nodeId is required' });
    }

    var user_id = new mongoose.Types.ObjectId(req.user.id);  // Convert string to ObjectId
    const chatlistPipeline = [
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          as: "senderDetails"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "receiverId",
          foreignField: "_id",
          as: "receiveDetails"
        }
      },
      {
        $addFields: {
          matchedField: {
            $cond: {
              if: { $eq: ["$senderId", user_id] },
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
          nodeId: nodeId
        }
      },
      {
        $project: {
          _id: 1,
          senderId: 1,
          receiverId: 1,
          nodeId: 1,
          userId: 1,
          text: 1,
          date: 1,
          time: 1,
          senderDetails: 1,
          matchedField: 1,
          receiveDetails: 1,
        }
      }
    ];
    const dataList = await Message.aggregate(chatlistPipeline).exec();
    const matchedData = dataList.map(item => {
      if (item.matchedField == "senderData") {
        return {
          myData: item.senderDetails,
          userData: item.receiveDetails,
          nodeId: item.nodeId,
          userId: item.userId,
          text: item.text,
          date: item.date,
          time: item.time
        };
      } else {
        return {
          userData: item.senderDetails,
          myData: item.receiveDetails,
          nodeId: item.nodeId,
          userId: item.userId,
          text: item.text,
          date: item.date,
          time: item.time
        };
      }
    });
    return res.json({ data: matchedData });

  } catch (err) {
    console.error(err);  // Log error for debugging
    return res.status(500).json({ error: 'Internal server error' });
  }
}