export default {
  server: {
    port: 443,
    ssl: {
      keyPath: '<KEY-PATH>',
      certPath: '<CERT-PATH>',
      chainPath: '<CHAIN-PATH>'
    }
  },
  db: {
    user: '<USER>',
    host: '<HOST>',
    database: '<DATABASE>',
    password: '<PASSWORD>',
    port: 5432
  }
};
