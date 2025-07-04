import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verficationToken) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verficationToken
      ),
      category: "Email Verification",
    });

    console.log("Verification Email sent successfully", response);
  } catch (error) {
    console.log("Error sending verification email", error);
    res.status(400).json("Error sending verification email", error);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "9e74c4ca-9eb7-4429-be43-d044a08c3656",
      template_variables: {
        company_info_name: "Auth App",
        name: name,
      },
    });
    console.log("Welcome email sent successfully", response);
  } catch (error) {
    res.status(400).json("error sending welcome email", error);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password reset",
    });
    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.log("Error in sending password reset email", error);
    res.status(400).json("Error in sending password reset email", error);
  }
};

export const sendResetSuccessfulEmail = async (email) => {
  const recipient = [{ email }];

  try {
    const response = mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password reset seccessful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password reset",
    });
    console.log("Password reset successful  email sent");
  } catch (error) {
    console.log("error in sending reset success email");
    res.status(500).json({ error: error.message });
  }
};
