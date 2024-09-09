import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  // Send a password reset email
  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Password Reset Request',
        template: './reset-password', 
        context: { 
          resetUrl, // Pass the reset URL to the template
        },
      });
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new InternalServerErrorException('Failed to send password reset email');
    }
  }
}
