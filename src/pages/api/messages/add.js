import connectDB from 'utils/connectDB'
import messagesModel from 'models/messagesModel'

connectDB()

export default async function endpoint(req, res) {
  try {
    let { email1, email2, newMessage } = req.body
    let messages = []
    let update = await messagesModel.findOneAndUpdate(
      {
        email1: email1,
        email2: email2,
      },
      {
        $push: {
          messages: newMessage,
        },
      },
      { new: true }
    )
    messages = update.messages
    if (update === null) {
      let update2 = await messagesModel.findOneAndUpdate(
        {
          email1: email2,
          email2: email1,
        },
        {
          $push: {
            messages: newMessage,
          },
        },
        { new: true }
      )
      messages = update2.messages
    }
    return res.json({ messages })
  } catch (err) {
    return res.json({ err: err.message })
  }
}
