const prisma = require('../utils/prisma');

exports.createReturnRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shoeId, reason, condition } = req.body;

    const shoe = await prisma.shoe.findUnique({ where: { id: shoeId } });
    if (!shoe) {
      return res.status(404).json({ error: 'Shoe not found' });
    }

    if (shoe.userId !== userId) {
      return res.status(403).json({ error: 'This shoe does not belong to you' });
    }

    const existingReturn = await prisma.return.findFirst({
      where: { shoeId, status: { in: ['Requested', 'Approved', 'Received'] } }
    });

    if (existingReturn) {
      return res.status(400).json({ error: 'An active return request already exists for this shoe' });
    }

    const returnRequest = await prisma.return.create({
      data: {
        userId,
        shoeId,
        reason,
        condition
      }
    });

    await prisma.shoe.update({
      where: { id: shoeId },
      data: { status: 'Returned' }
    });

    res.status(201).json({
      message: 'Return request submitted successfully',
      return: returnRequest
    });
  } catch (error) {
    console.error('Create return request error:', error);
    res.status(500).json({ error: 'Failed to create return request' });
  }
};

exports.updateReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, finalAction } = req.body;

    const returnRequest = await prisma.return.findUnique({ where: { id } });
    if (!returnRequest) {
      return res.status(404).json({ error: 'Return request not found' });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (finalAction) updateData.finalAction = finalAction;

    const updatedReturn = await prisma.return.update({
      where: { id },
      data: updateData
    });

    if (status === 'Completed') {
      await prisma.shoe.update({
        where: { id: returnRequest.shoeId },
        data: { status: 'Returned' }
      });
    }

    res.json({
      message: 'Return updated successfully',
      return: updatedReturn
    });
  } catch (error) {
    console.error('Update return error:', error);
    res.status(500).json({ error: 'Failed to update return' });
  }
};

exports.getAllReturns = async (req, res) => {
  try {
    const returns = await prisma.return.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        shoe: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ returns });
  } catch (error) {
    console.error('Get all returns error:', error);
    res.status(500).json({ error: 'Failed to fetch returns' });
  }
};

exports.getReturnsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const returns = await prisma.return.findMany({
      where: { userId },
      include: { shoe: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ returns });
  } catch (error) {
    console.error('Get returns by user error:', error);
    res.status(500).json({ error: 'Failed to fetch returns' });
  }
};
