export const verificationEmailTemplate = ({ name, verifyUrl }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Verify Your Email</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0f172a;
      font-family: Arial, Helvetica, sans-serif;
      color: #e5e7eb;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #020617;
      border-radius: 14px;
      padding: 32px;
      box-shadow: 0 0 40px rgba(56, 189, 248, 0.15);
    }
    .logo {
      font-size: 24px;
      font-weight: 700;
      color: #38bdf8;
      text-align: center;
      margin-bottom: 24px;
    }
    .heading {
      font-size: 22px;
      margin-bottom: 12px;
      color: #ffffff;
    }
    .text {
      font-size: 15px;
      line-height: 1.6;
      color: #cbd5f5;
    }
    .button {
      display: inline-block;
      margin: 28px 0;
      padding: 14px 28px;
      background: linear-gradient(135deg, #38bdf8, #6366f1);
      color: #020617;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 600;
      text-align: center;
    }
    .footer {
      font-size: 13px;
      color: #94a3b8;
      margin-top: 24px;
      text-align: center;
    }
    .link {
      color: #38bdf8;
      word-break: break-all;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">TechLive</div>

    <h2 class="heading">Welcome, ${name} 👋</h2>

    <p class="text">
      Thanks for joining <strong>TechLive</strong>!  
      You’re just one step away from unlocking live coding sessions,
      collaborative learning, and real-time problem solving.
    </p>

    <p class="text">
      Please verify your email address by clicking the button below:
    </p>

    <div style="text-align: center;">
      <a href="${verifyUrl}" class="button">Verify Email</a>
    </div>

    <p class="text">
      If the button doesn’t work, copy and paste this link into your browser:
    </p>

    <p class="text link">${verifyUrl}</p>

    <p class="text">
      This link will expire in <strong>15 minutes</strong> for security reasons.
    </p>

    <div class="footer">
      If you didn’t create this account, you can safely ignore this email.
    </div>
  </div>
</body>
</html>
`;
