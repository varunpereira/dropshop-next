import connectDB from 'utils/connectDB'
import userModel from 'models/userModel'
import messagesModel from 'models/messagesModel'

connectDB()

export default async function endpoint(req, res) {
  try {
    let { email, anothersEmail } = req.body
    let find = await userModel.findOne({
      email: email,
      messageEmails: [anothersEmail],
    })
    console.log(find)
    if (find === null) {
      let update1 = await userModel.updateOne(
        {
          email: email,
        },
        {
          $push: {
            messageEmails: anothersEmail,
          },
        }
      )
      let update2 = await userModel.updateOne(
        {
          email: anothersEmail,
        },
        {
          $push: {
            messageEmails: email,
          },
        }
      )

      let createMessages = await new messagesModel({
        email1: email,
        email2: anothersEmail,
      }).save()
    }
    return res.json({ success: true })
  } catch (err) {
    return res.json({ err: err.message })
  }
}
