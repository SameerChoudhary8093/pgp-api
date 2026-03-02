import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SmsService {
    private readonly logger = new Logger(SmsService.name);

    // 🔥 HARD CODED VALUES (TEST ONLY)
    private readonly user = 'pgpparty';
    private readonly password = 'acc04c50fcXX';
    private readonly senderId = 'IPGPTY';
    private readonly templateId = '1707177217726034212';
    private readonly entityId = '1701165113133141933';
    private readonly endpoint = 'http://sms.indiaitinfotech.com/sendsms.jsp';

    generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async sendOtp(mobile: string): Promise<{ success: boolean; otp?: string }> {
        const cleanMobile = mobile.replace(/\D/g, '');
        const finalMobile =
            cleanMobile.length === 12 ? `+${cleanMobile}` : `+91${cleanMobile}`;

        const otp = this.generateOtp();

        const message = `${otp} is your verification code for People's Green Party.`;

        const url = `${this.endpoint}?user=${this.user}&password=${this.password}&senderid=${this.senderId}&mobiles=${finalMobile}&sms=${encodeURIComponent(
            message,
        )}&entityid=${this.entityId}&tempid=${this.templateId}&accusage=1&unicode=1`;

        try {
            // 🔥 FULL LOGGING
            this.logger.log('================ OTP SEND START ================');
            this.logger.log(`User: ${this.user}`);
            this.logger.log(`Sender ID: ${this.senderId}`);
            this.logger.log(`Template ID: ${this.templateId}`);
            this.logger.log(`Entity ID: ${this.entityId}`);
            this.logger.log(`Mobile: ${finalMobile}`);
            this.logger.log(`OTP Generated: ${otp}`);
            this.logger.log(`Final Message: ${message}`);

            const safeUrl = url.replace(this.password, '******');
            this.logger.log(`Final URL (password hidden): ${safeUrl}`);

            const response = await fetch(url);
            const text = await response.text();

            this.logger.log(`Provider Raw Response: ${text}`);
            this.logger.log('================ OTP SEND END ==================');

            const isSuccess =
                text.toLowerCase().includes('success') ||
                text.toLowerCase().includes('submitted') ||
                /^\d+$/.test(text.trim());

            return { success: isSuccess, otp: otp };
        } catch (error) {
            this.logger.error('SMS Sending Failed:', error);
            return { success: false };
        }
    }
}