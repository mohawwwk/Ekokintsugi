const QRCode = require('qrcode');
const prisma = require('../utils/prisma');

exports.generateQR = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { shoe: true, tree: true, reviews: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const qrData = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      shoe: user.shoe ? {
        shoeId: user.shoe.shoeId,
        productLine: user.shoe.productLine,
        size: user.shoe.size,
        status: user.shoe.status
      } : null,
      tree: user.tree ? {
        treeId: user.tree.treeId,
        plantType: user.tree.plantType,
        location: user.tree.location,
        status: user.tree.status
      } : null,
      points: {
        total: user.pointsTotal,
        remaining: user.pointsRemaining,
        used: user.pointsUsed
      },
      reviewsCompleted: user.reviews.length,
      maxReviews: 8,
      dashboardUrl: `${req.protocol}://${req.get('host')}/dashboard/${user.id}`
    };

    const qrImage = await QRCode.toDataURL(JSON.stringify(qrData), {
      width: 400,
      margin: 2,
      color: {
        dark: '#2E7D32',
        light: '#FFFFFF'
      }
    });

    res.json({
      qrCode: qrImage,
      userId: user.id,
      name: user.name,
      data: qrData
    });
  } catch (error) {
    console.error('Generate QR error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
};
