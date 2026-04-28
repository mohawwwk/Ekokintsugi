const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const SHOE_PREFIXES = ['EKO-', 'KNT-', 'CIR-'];
const TREE_PREFIXES = ['TR-', 'TRE-', 'TREE-'];
const PLANT_TYPES = ['Bamboo', 'Mango', 'Teak', 'Coconut', 'Neem', 'Palm', 'Banana', 'Jackfruit', 'Rubber', 'Cashew'];
const LOCATIONS = ['Bali, Indonesia', 'Chiang Mai, Thailand', 'Kerala, India', 'Lombok, Indonesia', 'Siem Reap, Cambodia', 'Hoi An, Vietnam', 'Palawan, Philippines', 'Ubud, Indonesia', 'Pai, Thailand', 'Kampot, Cambodia'];
const PRODUCT_LINES = ['EkoKintsugi Classic', 'EkoKintsugi Sport', 'EkoKintsugi Casual', 'EkoKintsugi Formal', 'EkoKintsugi Outdoor'];
const SIZES = ['38', '39', '40', '41', '42', '43', '44', '45', '46', '47'];
const CITIES = ['Bali', 'Chiang Mai', 'Kochi', 'Lombok', 'Siem Reap', 'Hoi An', 'Puerto Princesa', 'Ubud', 'Pai', 'Kampot'];
const ROLES = ['intern', 'team', 'supporter'];

function generateShoeId() {
  const prefix = SHOE_PREFIXES[Math.floor(Math.random() * SHOE_PREFIXES.length)];
  const number = String(Math.floor(Math.random() * 9000) + 1000);
  return `${prefix}${number}`;
}

function generateTreeId() {
  const prefix = TREE_PREFIXES[Math.floor(Math.random() * TREE_PREFIXES.length)];
  const number = String(Math.floor(Math.random() * 9000) + 1000);
  return `${prefix}${number}`;
}

function generatePassword(name) {
  return bcrypt.hashSync(name.toLowerCase().replace(/\s/g, '') + '123', 10);
}

function generatePhone() {
  return `+62${Math.floor(Math.random() * 900000000 + 100000000)}`;
}

const users = [
  { name: 'Made Surya', email: 'made@ekokintsugi.com', role: 'intern' },
  { name: 'Ketut Sari', email: 'ketut@ekokintsugi.com', role: 'team' },
  { name: 'Putu Ananda', email: 'putu@ekokintsugi.com', role: 'team' },
  { name: 'Nyoman Putri', email: 'nyoman@ekokintsugi.com', role: 'supporter' },
  { name: 'Komang Wati', email: 'komang@ekokintsugi.com', role: 'supporter' },
  { name: 'Bagus Putra', email: 'bagus@ekokintsugi.com', role: 'supporter' },
  { name: 'Ayu Lestari', email: 'ayu@ekokintsugi.com', role: 'supporter' },
  { name: 'Darma Wirawan', email: 'darma@ekokintsugi.com', role: 'team' },
  { name: 'Shinta Dewi', email: 'shinta@ekokintsugi.com', role: 'supporter' },
  { name: 'Rama Susanto', email: 'rama@ekokintsugi.com', role: 'admin' }
];

async function seed() {
  try {
    console.log('Starting seed...');

    await prisma.return.deleteMany();
    await prisma.review.deleteMany();
    await prisma.shoe.deleteMany();
    await prisma.tree.deleteMany();
    await prisma.user.deleteMany();

    console.log('Cleared existing data');

    for (let i = 0; i < users.length; i++) {
      const userData = users[i];

      let shoeId = generateShoeId();
      while (await prisma.shoe.findUnique({ where: { shoeId } })) {
        shoeId = generateShoeId();
      }

      let treeId = generateTreeId();
      while (await prisma.tree.findUnique({ where: { treeId } })) {
        treeId = generateTreeId();
      }

      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          phone: generatePhone(),
          password: generatePassword(userData.name),
          role: userData.role,
          city: CITIES[i],
          address: `${i + 1} ${userData.name.split(' ')[0]} Street`,
          shoeSize: SIZES[i],
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          qrCode: `https://ekokintsugi.com/qr/user-${i + 1}`,
          pointsTotal: 100,
          pointsUsed: 0,
          pointsRemaining: 100
        }
      });

      await prisma.shoe.create({
        data: {
          shoeId,
          productLine: PRODUCT_LINES[i % PRODUCT_LINES.length],
          size: SIZES[i],
          status: i < 3 ? 'Delivered' : 'PreBooked',
          userId: user.id
        }
      });

      await prisma.tree.create({
        data: {
          treeId,
          plantType: PLANT_TYPES[i],
          location: LOCATIONS[i],
          status: 'Symbolic Tree Parent',
          userId: user.id
        }
      });

      console.log(`Created user: ${userData.name} (${userData.role})`);
    }

    const adminUser = await prisma.user.findUnique({ where: { email: 'rama@ekokintsugi.com' } });
    if (adminUser) {
      await prisma.user.update({
        where: { id: adminUser.id },
        data: { role: 'admin' }
      });
    }

    console.log('\nSeed completed successfully!');
    console.log(`Created ${users.length} users with shoes and trees`);
    console.log('\nTest accounts:');
    console.log('Admin: rama@ekokintsugi.com (password: ramasusanto123)');
    console.log('Intern: made@ekokintsugi.com (password: madesurya123)');
    console.log('Team: ketut@ekokintsugi.com (password: ketutsari123)');
    console.log('Supporter: nyoman@ekokintsugi.com (password: nyomanputri123)');

  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
