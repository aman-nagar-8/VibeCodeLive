export const changePasswordTemplate = (otp) => `
<div style="font-family: Arial, sans-serif; max-width: 500px;">
  <p>Hello,</p>

  <p>We received a request to reset the password for your VibeCodeLive account.</p>

  <p>Your verification code is:</p>

  <h2>${otp}</h2>

  <p>This code will expire in 10 minutes.</p>

  <p>If you did not request a password reset, you can ignore this email.</p>

  <p>Thanks,<br>VibeCodeLive Support</p>
</div>
`;
