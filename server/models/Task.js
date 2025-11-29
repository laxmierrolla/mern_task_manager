const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  createdAt: { type: Date, default: Date.now }

});

const AttachmentSchema = new mongoose.Schema({
  filename: String,
  url: String,
  createdAt: { type: Date, default: Date.now }
});

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  completed: { type: Boolean, default: false },
  dueDate: Date,
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [{type: String}],
  comments: [CommentSchema],
  attachments: [AttachmentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
