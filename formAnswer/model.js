const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const formAnswerSchema = new Schema({
  formId: {
    type: Schema.Types.ObjectId,
    ref: 'Form'
  },
  value: {
    type: Schema.Types.Mixed
  }
});

formAnswerSchema.set('toJSON', { getters: true, virtuals: false });
module.exports = mongoose.model('FormAnswer', formAnswerSchema);