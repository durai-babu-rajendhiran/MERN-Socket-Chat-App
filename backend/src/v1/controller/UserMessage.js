const Message = require("../model/Message");
const responseHandlier = require('../Utils/Response');

exports.addMessage = async (req, res, next) => {
  try{
    const newMessage = new Message(req.body);
    await newMessage.save();
    return responseHandlier.successResponse(true, newMessage, res);
  }catch(err) {
    return responseHandlier.errorResponse(false,err, res);
  }
};