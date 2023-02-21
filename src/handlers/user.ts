import prisma from '../db'
import {comparePasswords, hashPassword, createJWT} from '../modules/auth';


export const createNewUser = async (req, res) => {
  const user = await prisma.user.create({
    data: {
      username: req.body.username,
      password: await hashPassword(req.body.password)
      // probably shouldn't await on an obj prop but we will handle errors later
      // so doesnt matter
    }
  })

  const token = createJWT(user);
  res.json({token})
}

export const signin = async (req, res) => {
  // check if user already has an account
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username
    }
  })

  // check if hashedPassword in db is the same as current user's submitted password
  const userIsValid = await comparePasswords(req.body.password, user.password);
  if (!userIsValid) {
    res.status(401);
    res.json({message: "not authorized"});
    return;
  }

  const token = createJWT(user);
  res.json(token);
}