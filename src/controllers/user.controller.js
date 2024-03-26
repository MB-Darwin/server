export const getUserInfo = async (req, res) => {};

export const generalEdit = async (req, res) => {
  try {
    const {
      name,
      email,
      imageUrl,
      phoneNum,
      address,
      location,
      region,
      city,
      zipCode,
      about,
    } = req.body;
    console.log(console.log(req.body));
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
