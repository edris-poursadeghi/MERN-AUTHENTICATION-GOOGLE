const cloudinary = require("cloudinary");
const fs = require("fs");

const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
});

const uploadCtrl = {
  uploadAvatar: (req, res) => {
    try {
      // console.log(req.files.file);

      const file = req.files.file;
      cloudinary.v2.uploader.upload(
        file.tempFilePath,
        {
          folder: "avatar",
          width: 150,
          height: 150,
          crop: "fill",
        },
        async (err, result) => {
          if (err) throw err;
          removeTmp(file.tempFilePath);

          res.json({ url: result.secure_url });

          // console.log({ restlt });
          /* 
{
  restlt: {
    asset_id: 'baa8fda9bce8fc15e772b32b89a932b1',
    public_id: 'avatar/fayukmh6zsppequndsvh',
    version: 1630154622,
    version_id: 'f9147199e293bfc97e7a8ea7ade6e708',
    signature: '836eff4f7062fa07bc0b1cb467f83bbcf746e024',
    width: 150,
    height: 150,
    format: 'jpg',
    resource_type: 'image',
    created_at: '2021-08-28T12:43:42Z',
    tags: [],
    bytes: 4214,
    type: 'upload',
    etag: '51360f09eecbe405ea73987404ae63b0',
    placeholder: false,
    url: 'http://res.cloudinary.com/dkzcwpimg/image/upload/v1630154622/avatar/fayukmh6zsppequndsvh.jpg',
    secure_url: 'https://res.cloudinary.com/dkzcwpimg/image/upload/v1630154622/avatar/fayukmh6zsppequndsvh.jpg',
    access_mode: 'public',
    original_filename: 'tmp-1-1630154619885',
    api_key: '843951277737654'
  }
}
*/
        }
      );
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
};

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

module.exports = uploadCtrl;
