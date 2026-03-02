
const fs = require('fs');

async function testBalance() {
    try {
        const envContent = fs.readFileSync('.env', 'utf8');
        const user = envContent.match(/SMS_USER="(.*)"/)[1];
        const pass = envContent.match(/SMS_PASS="(.*)"/)[1];

        const url = `http://sms.indiaitinfotech.com/getbalance.jsp?user=${user}&password=${pass}&accusage=1`;

        const response = await fetch(url);
        const text = await response.text();
        fs.writeFileSync('bal_out.txt', `Testing Balance: ${url.replace(pass, '****')} \nResponse: ${text}`);
    } catch (e) {
        fs.writeFileSync('bal_out.txt', `Error: ${e.message}`);
    }
}

testBalance();
