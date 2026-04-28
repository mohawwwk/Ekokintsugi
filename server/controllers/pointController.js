const prisma = require('../utils/prisma');

exports.addPoints = async (req, res) => {
  try {
    const { userId, points, reason } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        pointsTotal: { increment: parseInt(points) },
        pointsRemaining: { increment: parseInt(points) }
      }
    });

    res.json({
      message: `Added ${points} points to ${user.name}`,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        pointsTotal: updatedUser.pointsTotal,
        pointsRemaining: updatedUser.pointsRemaining
      }
    });
  } catch (error) {
    console.error('Add points error:', error);
    res.status(500).json({ error: 'Failed to add points' });
  }
};

exports.redeemPoints = async (req, res) => {
  try {
    const { userId, points } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.pointsRemaining < parseInt(points)) {
      return res.status(400).json({ error: 'Insufficient points' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        pointsUsed: { increment: parseInt(points) },
        pointsRemaining: { decrement: parseInt(points) }
      }
    });

    res.json({
      message: `Redeemed ${points} points from ${user.name}`,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        pointsTotal: updatedUser.pointsTotal,
        pointsUsed: updatedUser.pointsUsed,
        pointsRemaining: updatedUser.pointsRemaining
      }
    });
  } catch (error) {
    console.error('Redeem points error:', error);
    res.status(500).json({ error: 'Failed to redeem points' });
  }
};

exports.getPoints = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        pointsTotal: true,
        pointsUsed: true,
        pointsRemaining: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get points error:', error);
    res.status(500).json({ error: 'Failed to fetch points' });
  }
};
