import { sender, transporter } from "../config/mail.config.js";
import { otpEmailTemplate } from "./templates.js";
import { tempPasswordEmail } from "./templates.js";

const mailOption = ({ email, subject, html }) => ({
  from: sender,
  to: email,
  subject,
  html,
});

export const sendTempPassword = async ({
  full_name,
  temp_password,
  email,
  reg_number,
  expires_at,
}) => {
  try {
    // Basic validation
    if (!email || !temp_password || !full_name || !reg_number || !expires_at) {
      throw new Error("Missing required data to send temporary password email");
    }

    // Generate email HTML
    const content = tempPasswordEmail({
      full_name,
      reg_number,
      temp_password,
      expires_at,
    });

    // Send email
    await transporter.sendMail(
      mailOption({
        email,
        subject: "Exam Check Plus – Temporary Password",
        html: content,
      })
    );

    console.log(`✅ Temporary password email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send temporary password email:", error.message);
    throw error;
  }
};
export const sendOTPEmail = async ({ full_name, reg_number, otp, expires_at, email }) => {
  try {
    if (!email || !otp || !full_name) {
      throw new Error("Missing required user data for OTP email");
    }

    const content = otpEmailTemplate({ full_name, reg_number, otp, expires_at });

    await transporter.sendMail({
      from: sender,
      to: email,
      subject: "Exam Check Plus – OTP Verification",
      html: content,
    });

    console.log(`✅ OTP email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error.message);
    throw error;
  }
};