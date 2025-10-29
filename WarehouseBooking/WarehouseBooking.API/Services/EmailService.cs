using Resend;

namespace WarehouseBooking.API.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;
        private readonly IResend _resend;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger, IResend resend)
        {
            _configuration = configuration;
            _logger = logger;
            _resend = resend;
        }

        public async Task SendEmailConfirmationAsync(string toEmail, string userName, string confirmationLink)
        {
            var subject = "Confirm Your Email - Warehouse Booking";
            var body = GetEmailConfirmationTemplate(userName, confirmationLink);

            await SendEmailAsync(toEmail, subject, body);
        }

        public async Task SendPasswordResetAsync(string toEmail, string userName, string resetLink)
        {
            var subject = "Password Reset Request - Warehouse Booking";
            var body = GetPasswordResetTemplate(userName, resetLink);

            await SendEmailAsync(toEmail, subject, body);
        }

        public async Task SendWelcomeEmailAsync(string toEmail, string userName)
        {
            var subject = "Welcome to Warehouse Booking!";
            var body = GetWelcomeEmailTemplate(userName);

            await SendEmailAsync(toEmail, subject, body);
        }

        private async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                var fromEmail = _configuration["EmailSettings:FromEmail"] ?? "onboarding@resend.dev";
                var fromName = _configuration["EmailSettings:FromName"] ?? "Warehouse Booking";

                var message = new EmailMessage();
                message.From = $"{fromName} <{fromEmail}>";
                message.To.Add(toEmail);
                message.Subject = subject;
                message.HtmlBody = body;

                var response = await _resend.EmailSendAsync(message);

                _logger.LogInformation("Email sent successfully to {Email}", toEmail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email to {Email}", toEmail);
                // Don't throw - email failures shouldn't break the registration flow
                // In production, you might want to queue this for retry
            }
        }

        private string GetEmailConfirmationTemplate(string userName, string confirmationLink)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #4CAF50; color: white; padding: 20px; text-align: center; }}
        .content {{ background-color: #f9f9f9; padding: 30px; }}
        .button {{ display: inline-block; padding: 12px 30px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
        .footer {{ text-align: center; padding: 20px; color: #777; font-size: 12px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Welcome to Warehouse Booking!</h1>
        </div>
        <div class='content'>
            <h2>Hi {userName},</h2>
            <p>Thank you for registering with Warehouse Booking. To complete your registration, please confirm your email address by clicking the button below:</p>
            <p style='text-align: center;'>
                <a href='{confirmationLink}' class='button'>Confirm Email Address</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style='word-break: break-all; color: #4CAF50;'>{confirmationLink}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account with us, please ignore this email.</p>
        </div>
        <div class='footer'>
            <p>&copy; 2025 Warehouse Booking. All rights reserved.</p>
        </div>
    </div>
</body>
</html>";
        }

        private string GetPasswordResetTemplate(string userName, string resetLink)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #FF5722; color: white; padding: 20px; text-align: center; }}
        .content {{ background-color: #f9f9f9; padding: 30px; }}
        .button {{ display: inline-block; padding: 12px 30px; background-color: #FF5722; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
        .footer {{ text-align: center; padding: 20px; color: #777; font-size: 12px; }}
        .warning {{ background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Password Reset Request</h1>
        </div>
        <div class='content'>
            <h2>Hi {userName},</h2>
            <p>We received a request to reset your password. Click the button below to set a new password:</p>
            <p style='text-align: center;'>
                <a href='{resetLink}' class='button'>Reset Password</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style='word-break: break-all; color: #FF5722;'>{resetLink}</p>
            <p>This link will expire in 1 hour.</p>
            <div class='warning'>
                <strong>Security Notice:</strong> If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
            </div>
        </div>
        <div class='footer'>
            <p>&copy; 2025 Warehouse Booking. All rights reserved.</p>
        </div>
    </div>
</body>
</html>";
        }

        private string GetWelcomeEmailTemplate(string userName)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #2196F3; color: white; padding: 20px; text-align: center; }}
        .content {{ background-color: #f9f9f9; padding: 30px; }}
        .footer {{ text-align: center; padding: 20px; color: #777; font-size: 12px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Welcome Aboard!</h1>
        </div>
        <div class='content'>
            <h2>Hi {userName},</h2>
            <p>Your email has been confirmed successfully!</p>
            <p>You can now enjoy full access to our warehouse booking platform. Here's what you can do:</p>
            <ul>
                <li>Browse available warehouse spaces</li>
                <li>Book warehouse units that fit your needs</li>
                <li>Manage your bookings</li>
                <li>Track your payments</li>
            </ul>
            <p>If you have any questions or need assistance, feel free to contact our support team.</p>
            <p>Happy booking!</p>
        </div>
        <div class='footer'>
            <p>&copy; 2025 Warehouse Booking. All rights reserved.</p>
        </div>
    </div>
</body>
</html>";
        }
    }
}
