import { Sequelize, DataTypes } from 'sequelize';
import { DB_USERNAME, DB_PASSWORD } from 'config/env.config';

export const sequelize = new Sequelize('paystackdb', DB_USERNAME, DB_PASSWORD, {
  dialect: 'postgres',
})

export const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  message: DataTypes.STRING,
  movieEpisodeId: DataTypes.INTEGER,
  ipAddress: DataTypes.STRING,
})

export const MovieComments = sequelize.define('MovieComments', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  movieEpisodeId: DataTypes.INTEGER,
  commentsCount: DataTypes.INTEGER,
})
