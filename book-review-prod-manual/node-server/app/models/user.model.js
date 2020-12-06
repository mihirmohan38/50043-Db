module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'users',
        {
            reviewerID: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING,
            },
            email: {
                type: DataTypes.STRING,
            },
            password: {
                type: DataTypes.STRING,
            },
        },
        { timestamps: false }
    );

    return User;
};
