import prisma from '../db'

// Get all
export const getAllUpdates = async (req, res) => {
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id
    },
    include: {
      updates: true  // joins user's products to query
    }
  });
  const updates = products.reduce(
    (allUpdates, product) => {
      return [...allUpdates, ...product.updates]
    },
    []
  )
  res.json({data: updates});
}

// Get one
export const getOneUpdate = async (req, res) => {
  const update = await prisma.update.findUnique({
    where: {
      id: req.params.id
    },
  });
  res.json({data: update});
}

// Create one
export const createUpdate = async (req, res) => {
  const product = await prisma.product.findUnique({
    where: {
      id: req.body.productId
    }
  })

  if(!product) {
    // product does not exist or does not belong to user
    return res.json({message: 'product non-existent or unauthorized'})
  }
  console.log("req.body", req.body)
  const update = await prisma.update.create({
    data: {
      title: req.body.title,
      body: req.body.body,
      product: {connect: {id: product.id}}
    }
  })

  res.json({data: update})
}

// Update one
export const updateUpdate = async (req, res) => {
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id
    },
    include: {
      updates: true
    }
  });

  const updates = products.reduce(
    (allUpdates, product) => {
      return [...allUpdates, ...product.updates]
    },
    []
  )

  const match = updates.find(update => update.id === req.params.id);
  if (!match) {
    res.json({message: 'no matching update found'})
  }

  const updatedUpdate = await prisma.update.update({
      where: {
          id: req.params.id,
      },
      data: req.body
    });

  res.json({data: updatedUpdate})
}

// Delete one
export const deleteUpdate = async (req, res) => {
  const deleted = await prisma.update.delete({
    where: {
      id: req.params.id,
    }
  })
  res.json({data: deleted})
}