const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
    },
});


export const sendMail = async (to: string, subject: string, html: string) => {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: to,
        subject: 'no-reply: ' + subject,
        html: html,
    };

    await transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
            return false;
        } else {
            return true;
        }
    });
}
const resetPasswordTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #5cb85c;
            margin-bottom: 20px;
        }
        p {
            line-height: 1.6;
        }
        a {
            color: #5cb85c;
            text-decoration: none;
        }
        .button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            color: #fff;
            background-color: #5cb85c;
            border-radius: 4px;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Password Reset</h1>
        <p>Hello, {{name}}!</p>
        <p>You recently requested to reset your password for your account.</p>
        <p>Use the button below to reset it:</p>
        <a href="{{action_url}}" class="button">Reset Password</a>
        <p>This password reset link is only valid for the next 1 hours.</p>
        <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
        <p>Thanks,<br>The Dongdan Team</p>
    </div>
</body>
</html>
`;

export const generateHTML = (name: string, url: string) => {

    let htmlString = resetPasswordTemplate;

    htmlString = htmlString.replace('{{name}}', name);
    htmlString = htmlString.replace('{{action_url}}', url);

    return htmlString;
}