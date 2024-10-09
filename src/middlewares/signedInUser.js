const AuthService = require("../auth/auth.service");

async function signedInUserMiddleware(req, res, next) {
  try {
    const { authorization, "x-refresh-token": refreshToken } = req.headers;
    const [tokenType, accessToken] = authorization.split(" ");
    
    if (!tokenType || !accessToken) {
      return res.status(400).send({ message: "Malformed access token" });
    }

    const { success, data } = await AuthService.getAuthenticatedUser(
      accessToken,  
      refreshToken
    );

    if (success) {
      data.password = null;
      req.user = data;
      
      return next();
    } else {
      return res
        .status(403)
        .json({
          message: "User must be logged in as admin to perform this action",
        });
    }
  } catch (e) {
    return res.status(401).send({ message: "User must be logged in as admin to perform this action" });
  }
}

module.exports = signedInUserMiddleware;