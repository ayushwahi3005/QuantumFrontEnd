

const PROXY_CONF = [
  {
    context: ["/api"],
    target: "http://localhost:8084",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
    pathRewrite: {'^/api' : ''}
  },
  {
    context: ["/test"],
    target: "https://zjjf6fv7xrgtlwvgqu7kh3zbcq0iycvd.lambda-url.us-east-1.on.aws",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
    pathRewrite: {'^/test' : ''}
  },
  {
    context: ["/local"],
    target: "http://localhost:8085",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
    pathRewrite: {'^/local' : ''}
  },
  {
    context: ["/myCustomer"],
    target: "https://hcb4a26ocqqj7453ah4q6tesly0xvwaw.lambda-url.us-east-1.on.aws",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
    pathRewrite: {'^/myCustomer' : ''}
  },
  {
    context: ["/localCustomer"],
    target: "http://localhost:8080",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
    pathRewrite: {'^/localCustomer' : ''}
  },
  {
    context: ["/asset"],
    target: "https://t6ntbxclf55jwudr66qtkxwkz40mchui.lambda-url.us-east-1.on.aws",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
    pathRewrite: {'^/asset' : ''}
  },
  {
    context: ["/tempAssets"],
    target: "http://localhost:8081",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
    pathRewrite: {'^/tempAssets' : ''}
  },
  {
    context: ["/secret"],
    target: "https://xxjajexjyobempqti23tx4fivm0puczu.lambda-url.us-east-1.on.aws/",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
    pathRewrite: {'^/secret' : ''}
  }
];

module.exports = PROXY_CONF;
        