import AWSConfig from "../core/config/config.aws";

const AWS = require("aws-sdk");

const AWSService = {};

// Initialize AWS
AWS.config.update({
  accessKeyId: AWSConfig.AWS.credentials.accessKey,
  secretAccessKey: AWSConfig.AWS.credentials.secretKey
});

const s3 = new AWS.S3();

AWSService.uploadImage = async (base64Image, prefix) => {
  const base64Data = new Buffer(
    base64Image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  const type = base64Image.split(";")[0].split("/")[1];
  const params = {
    Bucket: AWSConfig.AWS.S3.bucketName,
    Key: `${prefix}${generateUniqueFileName()}.${type}`,
    Body: base64Data,
    ACL: "public-read",
    ContentEncoding: "base64", // required
    ContentType: `image/${type}` // required. Notice the back ticks
  };

  return s3.upload(params).promise();
};

const generateUniqueFileName = () => {
  const timeStamp = new Date().getTime();
  const randomInt = Math.floor(Math.random() * 1000000 + 1);

  return `${timeStamp}-${randomInt}`;
};

export default AWSService;
