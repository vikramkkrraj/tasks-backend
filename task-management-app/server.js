const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 4000;


mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT , () => {
        console.log(`Server running on port ${PORT}`);
    })
})
.catch((err) => {
    console.log(err);
})
