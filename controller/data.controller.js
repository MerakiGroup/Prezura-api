import pressureDataModel from "../models/pressure.model";
import commondbService from "../services/commondb.service";

const dataController = {};

const calculateMean = async () => {
  const pressureData = [];
  try {
    const dataSet = await pressureDataModel.find({
      createdAt: {
        $lte: new Date()
      }
    });

    let thumb = 0;
    let left = 0;
    let right = 0;
    let heel = 0;

    dataSet.forEach(element => {
      thumb += element.data[0].value;
      left += element.data[1].value;
      right += element.data[2].value;
      heel += element.data[3].value;
    });

    const count = dataSet.length;
    console.log(">>>>", count);
    console.log("thumb", thumb / count);
    console.log("left", left / count);
    console.log("right", right / count);
    console.log("heel", heel / count);

    pressureData.push({
      //thumb
      value: thumb / count,
      x: 120,
      y: 40
    });

    pressureData.push({
      //left
      value: left / count,

      x: 40,
      y: 100
    });

    pressureData.push({
      // right
      // value: dataArray[2] * 4,
      value: right / count,
      x: 100,
      y: 90
    });

    pressureData.push({
      // heel
      // value: dataArray[3] * 4,
      value: heel / count,
      x: 80,
      y: 230
    });
  } catch (error) {
    console.log("error", error);
    return error;
  }

  return pressureData;
};

dataController.getPeriodicData = async (req, res) => {
  try {
    const pressureData = await calculateMean();
    console.log("countData", pressureData.length);
    const count = await pressureDataModel.count({});
    console.log("totalRecords", count);
    res.status(200).json({ data: pressureData });
  } catch (error) {
    console.log(error);
  }
};

dataController.getDisorders = async (req, res) => {
  const pressureData = await calculateMean();
  const thumb = pressureData[0].value;
  const left = pressureData[1].value;
  const right = pressureData[2].value;
  const heel = pressureData[3].value;

  const balanceMean = (left + right) / 2;
  console.log("right", right);
  console.log("left", left);
  console.log("bm", balanceMean);
  const leftPercentage = left * 100 / balanceMean;
  const rightPercentage = right * 100 / balanceMean;

  if (
    (leftPercentage > 100 || rightPercentage > 100) &&
    Math.abs(leftPercentage - rightPercentage) > 10
  ) {
    return res.status(200).json({
      message: "Body imbalance Detected",
      disCord: 1,
      data: pressureData
    });
  }

  return res.status(200).json({ message: "No issues" });
};

export default dataController;
