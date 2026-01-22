require('dotenv').config();

module.exports = {
  development: {
    username: 'basesg_user',
    password: 'mltGRBaN6jC8j9ZKoJnjZcWKwsNjIlMH',
    database: 'basesg',
    host: 'dpg-d5p95d3vbchc7390qlr0-a.oregon-postgres.render.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
