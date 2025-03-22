const isDev = process.env.NODE_ENV !== 'prod';

module.exports = {
  images: {
    domains: isDev
      ? ['localhost'] // ✅ Development (local API/images)
      : ['roadtocareer.net'], // ✅ Production
  },
};
