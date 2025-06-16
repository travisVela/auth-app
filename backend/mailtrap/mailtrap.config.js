import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

export const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_API_TOKEN,
});

export const sender = {
  email: "hello@travisvela.com",
  name: "Travis",
};

//   ORIGINAL SETUP
// const client = new MailtrapClient({
//   token: TOKEN,
// });

// const sender = {
//   email: "hello@travisvela.com",
//   name: "Mailtrap Test",
// };
// const recipients = [
//   {
//     email: "johntravisvela@gmail.com",
//   },
// ];

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);
