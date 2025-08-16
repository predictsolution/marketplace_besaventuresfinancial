import { NextApiRequest, NextApiResponse } from 'next';
import { verify_email } from '@utils/main_utils';
import database from '@utils/db';
import { getToken, GetTokenParams } from 'next-auth/jwt';
import Users from '@models/Users';
import { ObjectId } from 'mongoose';

const secret = process.env.NEXTAUTH_SECRET;

async function handler(
  req: NextApiRequest & GetTokenParams,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(404);
  }

  const session = await getToken({ req, secret });

  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const { email } = req.body;

  const checkEmail = verify_email(email);

  if (!checkEmail.valid) {
    return res.json({
      added: checkEmail.valid,
      message: checkEmail.message,
    });
  }

  try {
    const dbConnection = await database.connect();

    if (!dbConnection) {
      return res
        .status(503)
        .json({ message: 'An error has occurred. Try it again later.' });
    }

    // Check if the email is already reserved
    const emailReserved = await Users.findOne({
      user_address: { $ne: session.address },
      user_email: checkEmail.email,
    });

    if (emailReserved != null) {
      await database.disconnect();
      return res.json({
        updated: false,
        message: 'The email address already belongs to an account',
      });
    }

    const userId: ObjectId = session._id as ObjectId;

    const accountUpdated = await Users.updateOne(
      { _id: userId, user_address: session.address },
      { $set: { user_email: checkEmail.email } },
      { upsert: true }
    );

    await database.disconnect();

    if (
      (accountUpdated.acknowledged && accountUpdated.modifiedCount) ||
      accountUpdated.upsertedId
    ) {
      return res.json({
        updated: true,
        message: 'Your game account has been created successfully',
      });
    }

    return res.json({
      updated: false,
      message: 'Error updating your account',
    });
  } catch (error) {
    console.log('Error updating email:');
    console.error(error);
    return res
      .status(503)
      .json({ message: 'An error has occurred. Try it again later.' });
  } finally {
    await database.disconnect();
    return res.status(503);
  }
}

export default handler;
