const mongoose = require('mongoose');
 
const Schema = mongoose.Schema;
 
const BookMark = new Schema({
  type: String,
  name : String,
  upperDirectory: String,
  url : String,
  og_title : String,
  og_description : String,
  og_image : String,
  date: {
    created : {type:Date, default:Date.now},
    edited : {type:Date, default:Date.now}
  },
  is_edited : {type:Boolean, default:false}
})
 
module.exports = mongoose.model('bookmark',BookMark);