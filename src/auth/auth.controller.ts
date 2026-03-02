import { Controller, Post, Body, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { OtpService } from './otp.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
    constructor(
        private otpService: OtpService,
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    @Post('send-otp')
    async sendOtp(@Body() body: { phone: string }) {
        if (!body.phone) throw new BadRequestException('Phone number is required');

        // Optional: Check if user exists if this is for Login only
        // const user = await this.prisma.user.findUnique({ where: { phone: body.phone } });
        // if (!user) throw new BadRequestException('User not registered');

        await this.otpService.sendOtp(body.phone);
        return { message: 'OTP sent successfully' };
    }

    @Post('verify-otp')
    async verifyOtp(@Body() body: { phone: string; code: string }) {
        if (!body.phone || !body.code) throw new BadRequestException('Phone and Code are required');

        const result = await this.otpService.verifyOtp(body.phone, body.code);
        if (!result.success) throw new UnauthorizedException(result.message || 'Invalid or expired OTP');

        // Find the user to issue a JWT
        const cleanPhone = body.phone.replace(/[^0-9]/g, '');
        const searchPhone = cleanPhone.slice(-10);
        const standardFormat = `+91${searchPhone}`;

        const user = await (this.prisma as any).user.findFirst({
            where: {
                OR: [
                    { phone: body.phone },
                    { phone: searchPhone },
                    { phone: `0${searchPhone}` },
                    { phone: standardFormat },
                ],
            },
        });

        if (!user) {
            // If user doesn't exist, we might return a status saying "OTP Verified, proceed to register"
            return {
                verified: true,
                registered: false,
                message: 'OTP verified, please complete registration'
            };
        }

        // Issue JWT for existing user
        const payload = {
            sub: user.authUserId,
            id: user.id,
            phone: user.phone,
            role: user.role
        };

        return {
            verified: true,
            registered: true,
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                memberId: user.memberId
            }
        };
    }
}
