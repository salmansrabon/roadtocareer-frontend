const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  images: {
    remotePatterns: isDev
      ? [
          {
            protocol: 'http',
            hostname: 'localhost',
            port: '5000',
            pathname: '/api/images/**',
          },
        ]
      : [
          {
            protocol: 'https',
            hostname: 'sdetapi.roadtocareer.net',
            pathname: '/api/images/**',
          },
        ],
  },
};
