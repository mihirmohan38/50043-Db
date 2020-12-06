module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define(
        'review',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            asin: {
                type: DataTypes.STRING,
            },
            helpful: {
                type: DataTypes.STRING,
            },
            overall: {
                type: DataTypes.INTEGER,
            },
            reviewText: {
                type: DataTypes.TEXT,
            },
            reviewTime: {
                type: DataTypes.STRING,
            },
            reviewerID: {
                type: DataTypes.STRING,
                references: {
                    model: 'users',
                    key: 'reviewerID',
                },
            },
            reviewerName: {
                type: DataTypes.STRING,
            },
            summary: {
                type: DataTypes.STRING,
            },
            unixReviewTime: {
                type: DataTypes.INTEGER,
            },
        },
        { timestamps: false }
    );

    return Review;
};
