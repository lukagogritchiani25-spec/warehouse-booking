namespace WarehouseBooking.API.Services
{
    public interface IEmailService
    {
        Task SendEmailConfirmationAsync(string toEmail, string userName, string confirmationLink);
        Task SendPasswordResetAsync(string toEmail, string userName, string resetLink);
        Task SendWelcomeEmailAsync(string toEmail, string userName);
    }
}
