import mongoose from 'mongoose'

let schema = new mongoose.Schema(
  {
    email1: {
      type: String,
      required: true,
    },
    email2: {
      type: String,
      required: true,
    },
    messages: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.messages ||
  mongoose.model('messages', schema, 'messages')
