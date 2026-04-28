const prisma = require('../utils/prisma');

exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        shoe: true,
        tree: true,
        reviews: {
          orderBy: { weekNumber: 'asc' }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const reviewsCompleted = user.reviews.length;
    const reviewsRemaining = 8 - reviewsCompleted;

    res.json({
      user: {
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
        reviewsCompleted,
        reviewsRemaining,
        maxReviews: 8
      },
      shoe: user.shoe,
      tree: user.tree,
      reviews: user.reviews
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};
