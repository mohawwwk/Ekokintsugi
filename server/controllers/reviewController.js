const prisma = require('../utils/prisma');

exports.createReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { weekNumber, daysWorn, hoursPerDay, comfort, fit, sole, material, stitching, feedback } = req.body;

    if (weekNumber < 1 || weekNumber > 8) {
      return res.status(400).json({ error: 'Week number must be between 1 and 8' });
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        userId_weekNumber: { userId, weekNumber }
      }
    });

    if (existingReview) {
      return res.status(400).json({ error: `Review for week ${weekNumber} already submitted` });
    }

    const userReviews = await prisma.review.findMany({ where: { userId } });
    if (userReviews.length >= 8) {
      return res.status(400).json({ error: 'Maximum 8 reviews per user reached' });
    }

    for (let w = 1; w < weekNumber; w++) {
      const prevReview = await prisma.review.findUnique({
        where: { userId_weekNumber: { userId, weekNumber: w } }
      });
      if (!prevReview) {
        return res.status(400).json({ error: `Please complete week ${w} review before submitting week ${weekNumber}` });
      }
    }

    const review = await prisma.review.create({
      data: {
        userId,
        weekNumber,
        daysWorn: parseInt(daysWorn),
        hoursPerDay: parseInt(hoursPerDay),
        comfort: parseInt(comfort),
        fit: parseInt(fit),
        sole: parseInt(sole),
        material: parseInt(material),
        stitching: parseInt(stitching),
        feedback
      }
    });

    await prisma.user.update({
      where: { id: userId },
      data: { pointsRemaining: { increment: 10 } }
    });

    res.status(201).json({
      message: 'Review submitted successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
};

exports.getReviewsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { userId },
      orderBy: { weekNumber: 'asc' }
    });

    res.json({ reviews, count: reviews.length });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ reviews });
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};
