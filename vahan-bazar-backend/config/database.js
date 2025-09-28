import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let sequelize;

// 1) Local dev → SQLite (optional)
if (process.env.USE_SQLITE === 'true') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: { timestamps: true, underscored: true, createdAt: 'created_at', updatedAt: 'updated_at' }
  });
}
// 2) Render/Prod → Postgres via DATABASE_URL (with SSL)
else if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false }, // 🔑 Render Postgres needs this
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    define: { timestamps: true, underscored: true, createdAt: 'created_at', updatedAt: 'updated_at' }
  });
}
// 3) Fallback (manual local Postgres if DATABASE_URL not set)
else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'vahan_bazar',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'password',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
      define: { timestamps: true, underscored: true, createdAt: 'created_at', updatedAt: 'updated_at' }
    }
  );
}

export { sequelize };
export default sequelize;
