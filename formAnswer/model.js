const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const formAnswerSchema = new Schema({
  formId: {
    type: Schema.Types.ObjectId,
    ref: 'Form'
  },
  values: {
    type: Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  }
},
{
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

module.exports = mongoose.model('FormAnswer', formAnswerSchema);