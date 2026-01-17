
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Full 25 Loksabha -> 200 Vidhansabha Mapping
const RAJASTHAN_DATA = {
    "Ganganagar": ["Sadulshahar", "Ganganagar", "Karanpur", "Suratgarh", "Raisinghri", "Sangaria", "Hanumangarh", "Pilibanga"],
    "Bikaner": ["Khajuwala", "Bikaner West", "Bikaner East", "Kolayat", "Lunkaransar", "Dungargarh", "Nokha", "Anupgarh"],
    "Churu": ["Sadulpur", "Taranagar", "Sardarshahar", "Churu", "Ratangarh", "Sujangarh", "Nohar", "Bhadra"],
    "Jhunjhunu": ["Pilani", "Surajgarh", "Jhunjhunu", "Mandawa", "Nawalgarh", "Udaipurwati", "Khetri", "Fatehpur"],
    "Sikar": ["Lachhmangarh", "Dhod", "Sikar", "Danta Ramgarh", "Khandela", "Neem Ka Thana", "Srimadhopur", "Chomu"],
    "Jaipur Rural": ["Kotputli", "Viratnagar", "Shahpura", "Phulera", "Jhotwara", "Amber", "Jamwa Ramgarh", "Bansur"],
    "Jaipur": ["Hawa Mahal", "Vidhyadhar Nagar", "Civil Lines", "Kishanpole", "Adarsh Nagar", "Malviya Nagar", "Sanganer", "Bagru"],
    "Alwar": ["Tijara", "Kishangarh Bas", "Mundawar", "Behror", "Alwar Rural", "Alwar Urban", "Ramgarh", "Rajgarh-Laxmangarh"],
    "Bharatpur": ["Kathumar", "Kaman", "Nagar", "Deeg-Kumher", "Bharatpur", "Nadbai", "Weir", "Bayana"],
    "Karauli-Dholpur": ["Baseri", "Bari", "Dholpur", "Rajakhera", "Todabhim", "Hindaun", "Karauli", "Sapotra"],
    "Dausa": ["Bassi", "Chaksu", "Thanagazi", "Bandikui", "Mahuwa", "Sikrai", "Dausa", "Lalsot"],
    "Tonk-Sawai Madhopur": ["Gangapur", "Bamanwas", "Sawai Madhopur", "Khandar", "Malpura", "Niwai", "Tonk", "Deoli-Uniara"],
    "Ajmer": ["Dudu", "Kishangarh", "Pushkar", "Ajmer North", "Ajmer South", "Nasirabad", "Masuda", "Kekri"],
    "Nagaur": ["Ladnun", "Deedwana", "Jayal", "Nagaur", "Khinvsar", "Merta", "Degana", "Nawan"],
    "Pali": ["Sojat", "Marwar Junction", "Bali", "Sumerpur", "Osian", "Bhopalgarh", "Bilara", "Pali"],
    "Jodhpur": ["Phalodi", "Lohawat", "Shergarh", "Sardarpura", "Jodhpur", "Soorsagar", "Luni", "Pokaran"],
    "Barmer": ["Jaisalmer", "Sheo", "Barmer", "Baytoo", "Pachpadra", "Siwana", "Gudamalani", "Chohtan"],
    "Jalore": ["Ahore", "Jalore", "Bhinmal", "Sanchore", "Raniwara", "Sirohi", "Pindwara-Abu", "Reodar"],
    "Udaipur": ["Gogunda", "Jhadol", "Kherwara", "Udaipur Rural", "Udaipur", "Salumber", "Dhariawad", "Aspur"],
    "Banswara": ["Dungarpur", "Sagwara", "Chorasi", "Ghatol", "Garhi", "Banswara", "Bagidora", "Kushalgarh"],
    "Chittorgarh": ["Mavli", "Vallabhnagar", "Kapasan", "Begun", "Chittorgarh", "Nimbahera", "Bari Sadri", "Pratapgarh"],
    "Rajsamand": ["Beawar", "Merta", "Degana", "Jaitaran", "Bhim", "Kumbhalgarh", "Rajsamand", "Nathdwara"],
    "Bhilwara": ["Asind", "Mandal", "Sahara", "Bhilwara", "Shahpura (Bhilwara)", "Jahazpur", "Mandalgarh", "Hindoli"],
    "Kota": ["Keshoraipatan", "Bundi", "Pipalda", "Sangod", "Kota North", "Kota South", "Ladpura", "Ramganj Mandi"],
    "Jhalawar-Baran": ["Anta", "Kishanganj", "Baran-Atru", "Chhabra", "Dag", "Jhalrapatan", "Khanpur", "Manohar Thana"]
};

const GP_NAMES = ["Rampur", "Kishanpur", "Badli", "Chandpur", "Sultanpur"];

async function main() {
    console.log('Seeding FULL Rajasthan Locations (Wards + GPs)...');

    for (const [lsName, vsList] of Object.entries(RAJASTHAN_DATA)) {
        console.log(`Processing Loksabha: ${lsName}`);

        // Create or find Loksabha
        let loksabha = await prisma.loksabha.findUnique({ where: { name: lsName } });
        if (!loksabha) {
            loksabha = await prisma.loksabha.create({ data: { name: lsName } });
        }

        for (const vsName of vsList) {
            // Create or find Vidhansabha
            let vidhansabha = await prisma.vidhansabha.findFirst({
                where: { name: vsName, loksabhaId: loksabha.id }
            });

            if (!vidhansabha) {
                vidhansabha = await prisma.vidhansabha.create({
                    data: { name: vsName, loksabhaId: loksabha.id }
                });
            }

            // Create Default Local Units (Wards & GPs)
            const count = await prisma.localUnit.count({ where: { vidhansabhaId: vidhansabha.id } });

            // Add Wards if missing
            if (count < 5) {
                for (let i = 1; i <= 3; i++) {
                    // Check exist
                    const exists = await prisma.localUnit.findFirst({ where: { vidhansabhaId: vidhansabha.id, name: `Ward ${i}`, type: 'Ward' } });
                    if (!exists) {
                        await prisma.localUnit.create({
                            data: {
                                name: `Ward ${i}`,
                                type: 'Ward',
                                vidhansabhaId: vidhansabha.id
                            }
                        });
                    }
                }

                // Add Gram Panchayats
                for (let i = 0; i < 3; i++) {
                    const gpName = `${GP_NAMES[i]} GP`;
                    const exists = await prisma.localUnit.findFirst({ where: { vidhansabhaId: vidhansabha.id, name: gpName, type: 'GramPanchayat' } });
                    if (!exists) {
                        await prisma.localUnit.create({
                            data: {
                                name: gpName,
                                type: 'GramPanchayat',
                                vidhansabhaId: vidhansabha.id
                            }
                        });
                    }
                }
            }
        }
    }

    console.log('Full Rajasthan Seeding Completed!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
