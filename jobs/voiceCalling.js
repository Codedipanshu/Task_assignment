import cron from "node-cron";
import twilio from "twilio";
import User from "../models/userModel.js";
import Task from "../models/taskModel.js";

// Implementation for voice calling using Twilio
const voiceCalling = () => {
  cron.schedule("0 12 * * *", async () => {
    try {
      const users = await User.find().sort("priority");

      for (const user of users) {
        const tasks = await Task.find({
          user_id: user._id,
          status: "TODO",
          priority: 0,
        }).limit(1);

        if (tasks.length > 0) {
          //   Call the user using Twilio
          const client = new twilio.Twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_TWILIO_AUTH_TOKEN
          );
          const task = tasks[0];

          // Use Twilio to make a voice call to user.phone_number
          // Your Twilio API call goes here
          client.calls
            .create({
              twiml: `<Response><Say>Your task ${task.title} is pending.</Say></Response>`,
              to: `+91${user.phone_number}`,
              from: "+14788001053",
            })
            .then((call) => console.log(call.sid))
            .catch((e) => console.log(e));

          console.log(
            `Voice call made to ${user.phone_number} for task ${task.title}`
          );
        }
      }
    } catch (error) {
      console.error("Error making Twilio voice calls:", error);
    }
  });
};

export default voiceCalling;
