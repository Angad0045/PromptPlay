const axios = require("axios");
const { oauth2client } = require("../Config/googleConfig");
const userModel = require("../Models/userModel");

const signInWithGoogle = async (req, res) => {
  try {
    const { code } = req.body;
    // console.log("1. Code received:", !!code);

    const { tokens } = await oauth2client.getToken(code);
    // console.log("2. Tokens received:", !!tokens.access_token);

    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      },
    );
    // console.log("3. Google user:", userRes.data);

    const { name, email, picture } = userRes.data;

    let user = await userModel.findOne({ email });
    // console.log("4. User found in DB:", !!user);

    if (!user) {
      user = await userModel.create({ name, email, picture });
      // console.log("5. New user created:", !!user);
    }

    const token = user.createJWTToken();
    // console.log("6. Token generated:", token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    // console.log("7. Cookie set");

    const {
      name: userName,
      email: userEmail,
      picture: userPicture,
      planType,
      subscription,
    } = user;
    res.status(200).json({
      message: "Success",
      data: {
        name: userName,
        email: userEmail,
        picture: userPicture,
        planType,
        subscription,
      },
    });
    // console.log("8. Response sent");
  } catch (err) {
    // console.error("❌ Error at:", err.message);
    // console.error("❌ Full error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { signInWithGoogle };
