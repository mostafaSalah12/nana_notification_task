var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb://${process.env.MONGO_URL}:27017/integration`, {
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
