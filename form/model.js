const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const formSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  fields: {
    type: [
      {
        name: {
          type: String,
          required: true
        },
        title: {
          type: String,
          required: true
        },
        type: {
          type: String,
          enum: [
            'Text',
            'Number',
            'Date',
            'Location',
          ],
          required: true
        },
        required: {
          type: Boolean,
        },
        options: [
          {
            label: {
              type: String,
              required: true
            },
            value: {
              type: Schema.Types.Mixed
            }
          }
        ]
      }
    ],
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

module.exports = mongoose.model('Form', formSchema);