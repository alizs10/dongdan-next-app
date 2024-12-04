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
<html lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>بازنشانی رمز عبور</title>
</head>
<body style="background-color: #fff; color: #374151; margin: 0; padding: 20px; direction: rtl;">
    <div style="font-family: 'IRANSans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #3730a3; margin-bottom: 20px; font-size: 28px;">بازنشانی رمز عبور</h1>
        <p style="font-size: 16px;">سلام، {{name}}!</p>
        <p style="font-size: 16px;">شما اخیراً درخواست بازنشانی رمز عبور برای حساب خود را داده‌اید.</p>
        <p style="font-size: 16px;">از دکمه زیر برای بازنشانی آن استفاده کنید:</p>
        <a href="{{action_url}}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; color: #fff; background-color: #3730a3; border-radius: 4px; text-decoration: none;">بازنشانی رمز عبور</a>
        <p style="font-size: 16px;">این لینک بازنشانی رمز عبور فقط برای 1 ساعت آینده معتبر است.</p>
        <p style="font-size: 16px;">اگر شما درخواست بازنشانی رمز عبور نکرده‌اید، لطفاً این ایمیل را نادیده بگیرید یا در صورت داشتن سوال با پشتیبانی تماس بگیرید.</p>
        <p style="font-size: 16px;">باتشکر،<br>تیم دنگ دان</p>
    </div>
</body>
</html>
`;

const resetPasswordNotifyerTemplate = `<!DOCTYPE html>
<html lang="fa">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>بازنشانی رمز عبور</title>
</head>
<body style="background-color: #fff; color: #374151; margin: 0; padding: 20px; direction: rtl;">
    <div style="font-family: 'IRANSans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #3730a3; margin-bottom: 20px; font-size: 28px;">تغییر رمز عبور</h1>
        <p style="font-size: 16px; line-height: 1.6;">سلام، {{name}}!</p>
        <p style="font-size: 16px; line-height: 1.6;">این ایمیل برای اطلاع شما از تغییر رمز عبور حساب شما ارسال شده است.</p>
        <p style="font-size: 16px; line-height: 1.6;">اگر شما این تغییر را انجام داده‌اید، نیازی به انجام هیچ کاری نیست.</p>
        <p style="font-size: 16px; line-height: 1.6;">اگر شما این تغییر را انجام نداده‌اید، لطفاً فوراً با پشتیبانی تماس بگیرید.</p>
        <p style="font-size: 16px; line-height: 1.6;">باتشکر،<br>تیم دنگ دان</p>

    </div>
</body>
</html>
`;

export const generateResetPasswordNotifyerHTML = (name: string) => {
    let htmlString = resetPasswordNotifyerTemplate;
    htmlString = htmlString.replace('{{name}}', name);
    return htmlString;
}

export const generateResetPasswordHTML = (name: string, url: string) => {

    let htmlString = resetPasswordTemplate;

    htmlString = htmlString.replace('{{name}}', name);
    htmlString = htmlString.replace('{{action_url}}', url);

    return htmlString;
}