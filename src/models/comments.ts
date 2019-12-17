import { Sequelize, DataTypes, Model } from 'sequelize';
import { DB_USERNAME, DB_PASSWORD } from 'config/env.config';

export const sequelize = new Sequelize('paystackdb', DB_USERNAME, DB_PASSWORD, {
  dialect: 'postgres',
})

export class Comment extends Model {
  public id!: number;
  public message!: string;
  public movieEpisodeId!: number;
  public ipAddress!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export class MovieComments extends Model {
  public id!: number;
  public movieEpisodeId!: number;
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
  movieEpisodeId: DataTypes.INTEGER,
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
  movieEpisodeId: DataTypes.INTEGER,
  commentsCount: DataTypes.INTEGER,
}, {
  sequelize,
  tableName: 'movie_comments',
});
