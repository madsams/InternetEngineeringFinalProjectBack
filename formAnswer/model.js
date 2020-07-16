const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const formAnswerSchema = new Schema({
  formId: {
    type: Schema.Types.ObjectId,
    ref: 'Form'
  },
  value: {
    type: Schema.Types.Mixed,
    required: true
  },
  createAt: {
    type: Date,
    required: true
  }
},
{
  toJSON: {
    transform: function (doc, ret) {
      return ret = {id:ret._id , createAt: ret.createAt , ...ret.value};
    }
  }
});

module.exports = mongoose.model('FormAnswer', formAnswerSchema);