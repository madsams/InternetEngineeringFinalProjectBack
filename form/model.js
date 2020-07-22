const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const formSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  createdAt:{
    type: Date,
    required:true
  }
  ,
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
        options: { 
          type: [
            {
              label: {
                type: String,
                required: true
              },
              value: {
                type: Schema.Types.Mixed,
                require: true
              }
            }
          
          ]
        }
      }
    ],
    required: true
  },
  records:[{
    type: Schema.Types.ObjectId,
    ref: 'FormAnswer'
  }]
},
{
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      if (ret.records)
        ret.answersCount = ret.records.length;
      else
        ret.answersCount = 0;
      ret.fields = ret.fields.map(field => {
          delete field._id;
          if (field.options.length  === 0){
            delete field.options;
          }
          else{
            field.options = field.options.map(option=>{
              delete option._id;
              return option;
            });
          }
          return field;
      });
    }
  }
});

module.exports = mongoose.model('Form', formSchema);