export const tempPasswordEmail = ({
  full_name,
  reg_number,
  temp_password,
  expires_at
}) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Exam Check Plus – Temporary Login Details</h2>

      <p>Dear ${full_name},</p>

      <p>
        Your account has been successfully created on the
        <strong>Exam Check Plus</strong> platform.
      </p>

      <p>Please find your temporary login details below:</p>

      <ul>
        <li><strong>Registration Number:</strong> ${reg_number}</li>
        <li><strong>Temporary Password:</strong> ${temp_password}</li>
      </ul>

      <p>
        <strong>Note:</strong> This temporary password will expire on
        <strong>${expires_at}</strong>.
      </p>


      <p>
        If you did not request this account, please ignore this email or contact
        the system administrator.
      </p>

      <br />

      <p>Best regards,</p>
      <p>
        <strong>Exam Check Plus Team</strong><br />
        Automated Examination Management System
      </p>
    </div>
  `;
};
export const otpEmailTemplate = ({ full_name, reg_number, otp, expires_at }) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Exam Check Plus – Your One-Time Password (OTP)</h2>

      <p>Dear ${full_name},</p>

      <p>
        You requested a one-time password (OTP) to access your account on
        <strong>Exam Check Plus</strong>.
      </p>

      <p><strong>Registration Number:</strong> ${reg_number}</p>
      <p><strong>Your OTP:</strong> <span style="font-size: 18px; font-weight: bold;">${otp}</span></p>

      <p>
        <strong>Note:</strong> This OTP will expire on <strong>${expires_at}</strong>.
        Please use it within the valid time.
      </p>

      <p>
        If you did not request this OTP, please ignore this email or contact
        the system administrator.
      </p>

      <br />

      <p>Best regards,</p>
      <p>
        <strong>Exam Check Plus Team</strong><br />
        Automated Examination Management System
      </p>
    </div>
  `;
};
