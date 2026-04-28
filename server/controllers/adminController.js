const bcrypt = require('bcrypt');
const prisma = require('../utils/prisma');

const SHOE_PREFIXES = ['EKO-', 'KNT-', 'CIR-'];
const TREE_PREFIXES = ['TR-', 'TRE-', 'TREE-'];

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

function generateQRCode(userId) {
  return `https://ekokintsugi.com/qr/${userId}`;
}

exports.createUser = async (req, res) => {
  try {
    const { name, phone, email, password, role, city, address, shoeSize, startDate, endDate } = req.body;

    const userCount = await prisma.user.count();
    if (userCount >= 10) {
      return res.status(400).json({ error: 'Maximum 10 users allowed. Cannot create more users.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let shoeId = generateShoeId();
    let existingShoe = await prisma.shoe.findUnique({ where: { shoeId } });
    while (existingShoe) {
      shoeId = generateShoeId();
      existingShoe = await prisma.shoe.findUnique({ where: { shoeId } });
    }

    let treeId = generateTreeId();
    let existingTree = await prisma.tree.findUnique({ where: { treeId } });
    while (existingTree) {
      treeId = generateTreeId();
      existingTree = await prisma.tree.findUnique({ where: { treeId } });
    }

    const qrCode = generateQRCode('');

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
        role: role || 'supporter',
        city,
        address,
        shoeSize,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        qrCode,
        pointsTotal: 100,
        pointsRemaining: 100
      }
    });

    await prisma.shoe.create({
      data: {
        shoeId,
        productLine: 'EkoKintsugi Classic',
        size: shoeSize || '42',
        status: 'PreBooked',
        userId: user.id
      }
    });

    await prisma.tree.create({
      data: {
        treeId,
        plantType: 'Bamboo',
        location: 'Bali, Indonesia',
        status: 'Symbolic Tree Parent',
        userId: user.id
      }
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { qrCode: generateQRCode(user.id) }
    });

    const createdUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { shoe: true, tree: true }
    });

    res.status(201).json({
      message: 'User created successfully with shoe and tree assigned',
      user: createdUser
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        shoe: true,
        tree: true,
        reviews: {
          orderBy: { weekNumber: 'asc' }
        },
        returns: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const usersWithStats = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      city: user.city,
      address: user.address,
      shoeSize: user.shoeSize,
      startDate: user.startDate,
      endDate: user.endDate,
      pointsTotal: user.pointsTotal,
      pointsUsed: user.pointsUsed,
      pointsRemaining: user.pointsRemaining,
      qrCode: user.qrCode,
      reviewsCompleted: user.reviews.length,
      maxReviews: 8,
      shoe: user.shoe,
      tree: user.tree,
      reviews: user.reviews,
      returns: user.returns,
      createdAt: user.createdAt
    }));

    res.json({ users: usersWithStats, total: users.length });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        shoe: true,
        tree: true,
        reviews: { orderBy: { weekNumber: 'asc' } },
        returns: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user by id error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};
