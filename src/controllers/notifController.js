const admin = require("firebase-admin");
const { applicationDefault, initializeApp } = require("firebase-admin/app");
const { Messaging } = require("firebase-admin/messaging");
const { getUserProfile } = require("../repo/usersRepo");

// Firebase admin
const app = initializeApp({
  credential: applicationDefault(),
});

const Notification = new Messaging(app);

const notifSend = async (req, res) => {
  const { body } = req;
  console.log(body);
  try {
    // const result = await getUserProfile(req.userPayload.user_id);
    // if (result.length === 0)
    //   return res.status(404).json({ message: "id tidak ditemukan" });
    // console.log(result);
    // const token = result[0].token_fcm;
    const token = "dwbfwjfwoijn1233nbfsbkjwr";
    await Notification.send({
      token: token,
      notification: {
        title: body.title,
        body: body.message,
      },
    });
    return res.status(200).json({
      message: "notification sent",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error",
      error,
    });
  }
};

module.exports = { notifSend };
