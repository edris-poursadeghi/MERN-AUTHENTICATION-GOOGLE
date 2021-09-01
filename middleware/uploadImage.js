const fs = require("fs");

module.exports = async (req, res, next) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0)
      return res.status(400).json({ msg: "No files were  uploaded" });

    const file = req.files.file;

    if (file.size > 1024 * 1024) {
      removeTmp(file.tempFilePath);
      return res.status(400).json({ msg: "Size too large." });
    }

    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
      removeTmp(file.tempFilePath);
      return res.status(400).json({ msg: "File format is incorrect." });
    }

    next();
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const removeTmp = (removeFilePath) => {
  fs.unlink(removeFilePath, (err) => {
    if (err) throw err; 
  });
};

// files
/* 
{
  file: {
    name: 'adrien-olichon-R2OM3BvN-Uo-unsplash.jpg',
    data: <Buffer >,
    size: 6021160,
    encoding: '7bit',
    tempFilePath: 'D:\\PROJECTS\\MERN\\complete-authentication\\tmp\\tmp-1-1630144479072',
    truncated: false,
    mimetype: 'image/jpeg',
    md5: 'b6f7caf2d891f8b681389c901a958174',
    mv: [Function: mv]
  }
}

*/
