const MockController = {};

MockController.alerts = async (req, res) => {
  const bloodPressure = generateRandomNumber();
  const fracture = generateRandomNumber();
  const diabLegs = generateRandomNumber();

  res.status(200).json({ bloodPressure, fracture, diabLegs });
};

const generateRandomNumber = () => {
  const max = 100;
  const min = 0;
  return Math.random() * (max - min) - min;
};

export default MockController;
