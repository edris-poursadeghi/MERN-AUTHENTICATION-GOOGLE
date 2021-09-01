const User = require("../models/userModel");

const authAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 1)
      return res.status(500).json({ msg: "Admin resources access denied" });

    next();
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = authAdmin;
