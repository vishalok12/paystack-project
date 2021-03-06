import { Sequelize, DataTypes, Model } from 'sequelize';
import { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_DBNAME } from 'config/env.config';

export const sequelize = new Sequelize(DB_DBNAME, DB_USERNAME, DB_PASSWORD, {
  dialect: 'postgres',
  host: DB_HOST,
  ssl: false,
});

export class Comment extends Model {
  public id!: number;
  public message!: string;
  public movieId!: number;
  public ipAddress!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export class MovieComments extends Model {
  public id!: number;
  public movieId!: number;
  public commentsCount!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Comment.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  message: DataTypes.STRING,
  movieId: DataTypes.INTEGER,
  ipAddress: DataTypes.STRING,
}, {
  sequelize,
  tableName: 'comments',
});

MovieComments.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  movieId: DataTypes.INTEGER,
  commentsCount: DataTypes.INTEGER,
}, {
  sequelize,
  tableName: 'movie_comments',
});
