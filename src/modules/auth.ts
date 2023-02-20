import jwt from 'jsonwebtoken';

export const createJWT = (user) => {
  const token = jwt.sign(
    {id: user.id, username: user.username},
    process.env.JWT_SECRET
  )
  return token;
}

export const protectRoute = (req, res, next) => {
  const bearer = req.headers.authorization;

  // check if authorization header has a token
  if (!bearer) {
    res.status(401);
    res.json({message: 'not authorized'})
    return;
  }

  // check if there is a token value after "Bearer" prefix
  const [, token] = bearer.split(' ');

  if (!token) {
    res.status(401);
    res.json({message: 'no token'});
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET); // checks if token is valid based on JWT_SECRET

    // currently doesn't verify user if the same one based on a valid token
    req.user = user;
    next();
    return;
  } catch (e) {
    res.status(401);
    res.json({message: "not valid token"})
    console.error(e);
  }
}
