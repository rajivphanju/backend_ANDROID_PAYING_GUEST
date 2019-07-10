const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/STW304CEM_FinalAssignment',{
    useNewUrlParser:true,
    useCreateIndex:true
});
