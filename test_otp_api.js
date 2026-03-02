const fs = require('fs');

async function testOtpApi() {
    try {
        const envContent = fs.readFileSync('.env', 'utf8');
        const user = envContent.match(/SMS_USER="(.*)"/)[1];
        const pass = envContent.match(/SMS_PASS="(.*)"/)[1];

        const mobile = "+919636605727";
        // Let's use the actual exact template string now: 
        const message = "{#var#} is your verification code for People's Green Party.";

        const endpoint = "http://sms.indiaitinfotech.com/generateOtp.jsp";

        // Let's try sending as they expect it
        const url = `${endpoint}?userid=${user}&key=${pass}&mobileno=${encodeURIComponent(mobile)}&timetoalive=300&sms=${encodeURIComponent(message)}`;

        console.log("Testing:", url.replace(pass, '****'));
        const response = await fetch(url);
        const text = await response.text();
        console.log("Response:", text);
    } catch (e) {
        console.error("Error:", e.message);
    }
}
testOtpApi();
