import { Injectable } from '@nestjs/common';
import { SmsService } from './sms.service';

@Injectable()
export class OtpService {
    private otpStore = new Map<string, { otp: string; expires: number }>();

    constructor(private readonly smsService: SmsService) { }

    async sendOtp(phone: string) {
        const result = await this.smsService.sendOtp(phone);

        if (!result.success) {
            return { success: false, message: 'Failed to send OTP' };
        }

        const expiry = Date.now() + 5 * 60 * 1000;

        this.otpStore.set(phone, {
            otp: result.otp!,
            expires: expiry,
        });

        return {
            success: true,
            message: 'OTP sent successfully',
            otp: result.otp, // ⚠ remove in production
        };
    }

    async verifyOtp(phone: string, otp: string) {
        const record = this.otpStore.get(phone);

        if (!record) return { success: false, message: 'OTP not found' };

        if (Date.now() > record.expires) {
            this.otpStore.delete(phone);
            return { success: false, message: 'OTP expired' };
        }

        if (record.otp !== otp) {
            return { success: false, message: 'Invalid OTP' };
        }

        this.otpStore.delete(phone);

        return { success: true, message: 'OTP verified successfully' };
    }
}