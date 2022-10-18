const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

function isValidObjectId(id) {
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) return true;
    return false;
  }
  return false;
}

module.exports = isValidObjectId;
