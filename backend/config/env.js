module.exports = {
  nodeEnv: process.env.NODE_ENV,

  clientUrl: process.env.CLIENT_URL,

  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,

  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,

  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,

  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,

  cookie: {
    name: process.env.COOKIE_NAME,

    maxAge: Number(process.env.COOKIE_MAX_AGE),

    httpOnly: process.env.COOKIE_HTTP_ONLY === "true",

    secure: process.env.COOKIE_SECURE === "true",

    sameSite: process.env.COOKIE_SAME_SITE,
  },
};
