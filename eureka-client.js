const Eureka = require('eureka-js-client').Eureka;

// Eureka client configuration
const client = new Eureka({
  instance: {
    app: 'ms-reclamation',
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    port: {
      '$': process.env.PORT || 5000,
      '@enabled': true,
    },
    vipAddress: 'ms-reclamation',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
    statusPageUrl: `http://localhost:${process.env.PORT || 5000}/info`,
    healthCheckUrl: `http://localhost:${process.env.PORT || 5000}/health`,
    homePageUrl: `http://localhost:${process.env.PORT || 5000}`,
  },
  eureka: {
    // The URL of your Eureka server
    host: process.env.EUREKA_HOST || 'localhost',
    port: process.env.EUREKA_PORT || 8761,
    servicePath: '/eureka/apps/',
    maxRetries: 10,
    requestRetryDelay: 2000,
  },
});

module.exports = client;