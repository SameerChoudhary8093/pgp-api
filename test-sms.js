
const user = "pgpparty";
const password = "acc04c50fcXX"; // I will use the one in .env
const senderId = "abcdef"; // Using their example senderid for test
const mobile = "7737070807";
const message = "Test Message from PGP Project";
const endpoint = "http://sms.indiaitinfotech.com/sendsms.jsp";

async function testSms() {
    const url = `${endpoint}?user=${user}&password=${password}&senderid=${senderId}&mobiles=${mobile}&sms=${encodeURIComponent(message)}`;
    console.log("Testing URL (masked):", url.replace(password, "****"));
    const res = await fetch(url);
    const text = await res.text();
    console.log("Response:", text);
}

testSms();
