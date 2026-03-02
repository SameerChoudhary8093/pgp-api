
const fs = require('fs');

async function testSms() {
    try {
        const envContent = fs.readFileSync('.env', 'utf8');
        const user = envContent.match(/SMS_USER="(.*)"/)[1];
        const pass = envContent.match(/SMS_PASS="(.*)"/)[1];
        const endpoint = envContent.match(/SMS_ENDPOINT="(.*)"/)[1];
        const senderId = envContent.match(/SMS_SENDERID="(.*)"/)[1];
        const dltTeId = envContent.match(/SMS_DLT_TE_ID="(.*)"/)[1];
        const entityId = envContent.match(/SMS_ENTITY_ID="(.*)"/)[1];

        const mobile = "+917727079782";
        const message = `789645 is your verification code for People's Green Party.`;

        // URL format based on screenshot 4: +91, entityid, tempid, accusage=1, unicode=1
        const url = `${endpoint}?user=${user}&password=${pass}&senderid=${senderId}&mobiles=${encodeURIComponent(mobile)}&sms=${encodeURIComponent(message)}&entityid=${entityId}&tempid=${dltTeId}&accusage=1&unicode=1`;

        console.log("Testing:", url.replace(pass, '****'));
        const response = await fetch(url);
        const text = await response.text();
        console.log("Response:", text);
    } catch (e) {
        console.error("Error:", e.message);
    }
}

testSms();
