module.exports = {
    images: {
      remotePatterns: [
        {
          protocol: "http",
          hostname: "localhost",
          port: "5000",
          pathname: "/api/**",
        },
      ],
    },
  };
  