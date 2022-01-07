var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const connectDB = async () => {
    try {
        const db_url = process.env.IS_DOCKER ? process.env.MONGO_URL : 'localhost'
        await mongoose.connect(`mongodb://${db_url}:27017/notification`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });

        console.log('MongoDB connected!!')
    } catch (err) {
        console.log('Failed to connect to MongoDB', err)
    }
};

module.exports={
    connectDB
};
