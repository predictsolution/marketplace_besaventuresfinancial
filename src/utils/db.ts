import mongoose from 'mongoose';

mongoose.set('strictQuery', true);

async function connect() {
  if (mongoose.connection.readyState === 1) {
    return true;
  } else if (mongoose.connection.readyState === 2) {
    return false;
  }

  try {
    const db = await mongoose
      .connect(process.env.MONGODB_URI as string, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 60000,
      })
      .then((response) => {
        if (mongoose.connection.readyState) {
          return true;
        }

        return false;
      });

    return db;
  } catch (error) {
    console.log('An error occurred while connecting to the database');
    console.log(error);

    return false;
  }
}

async function disconnect() {
  if (mongoose.connection.readyState === 1) {
    setTimeout(async () => {
      await mongoose.disconnect();
    }, 1500);
  }
}

const database = { connect, disconnect };
export default database;
