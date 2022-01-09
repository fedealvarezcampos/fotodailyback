module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '104cf921453a8ee1b2ea2019f7ee58f9'),
  },
});
