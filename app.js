require('./db/db');

const User = require('./models/user');
const Listing = require('./models/listing');
const auth = require('./middleware/auth');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/uploads', express.static('./public/uploads'));
app.use(bodyParser.urlencoded({
    extended: false
}));

//uploads image
var storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, callback) => {
        let ext = path.extname(file.originalname);
        callback(null, file.fieldname + '-' + Date.now() + ext);
    }
});

//validations
var imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|PNG|gif)$/)) {
        return cb(new Error("You can upload only image files!"), false);
    }
    cb(null, true);
};

var upload = multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 1000000
    }
});



//uploads image
app.post('/upload', upload.single('imageFile'), (req, res) => {
    res.json(req.file);
});


app.post("/registeruser", (req, res) => {
   
    User.find({
            username: req.body.username
        })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                res.json( "username already exists"
                );
            } else {
                var user = new User(req.body);
                user.save().then(function (user) {
                        res.json(
                            "User Registered"
                        )
                    })
                    .catch(function (err) {
                        res.json( err
                        );
                    });
            }
        }).catch(function (err) {
            res.status(500).json({
                message: err
            });
        });
});

app.post("/login", async function (req, res) {

    if (req.body.username == "") {
        res.json({
            message: "Username is empty"
        });
    } else if (req.body.password == "") {
        res.json({
            message: "password is empty"
        });
    } else {
        try {
            const user = await User.checkCrediantialsDb(req.body.username, req.body.password);
            var user_type = user.user_type;
            var id = user._id;
            var username = user.username;
            if (user) {
                const token = await user.generateAuthToken();
                res.send({
                    token,
                    user_type,
                    id,
                    username
                });

            } else {
                res.json({
                    message: "User not found"
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

});

app.post("/addListings", (req, res) => {

    var listings = new Listing(req.body);
    listings.save().then(function (listings) {
        res.json(
           "Listing Added Successfully"
        )
    }).catch(function () {
        res.send(e);
    });

});






app.get('/getListings',function (req, res) {
    Listing.find({
        booking_status: false,approved_status:""
    }).then(function (listing) {
        res.send(listing);
    }).catch(function (e) {
        res.send(e);
    });
});

app.get('/fetchOne/:id', function (req, res) {
    var listingsID = req.params.id.toString();
    console.log(listingsID);
    Listing.find({
        _id: listingsID
    }).then(function (listing) {
        res.send(listing);

    }).catch(function (e) {
        res.send(e);
    });
});

//booking update
app.put('/updateListing/:id', function (req, res) {
    listingId = req.params.id.toString();
    console.log(listingId);
    console.log(req.body);
    Listing.findByIdAndUpdate(listingId, req.body, {
        new: true
    }).then(function (listing) {
        res.json("Update Successfull");
    }).catch(function (e) {
        res.send(e);
    });
});

app.get('/fetchlisting/:id', function (req, res) {
    var userID = req.params.id.toString();
    console.log(userID);
    Listing.find({
        userId: userID
    }).then(function (listing) {
        res.send(listing);

    }).catch(function (e) {
        res.send(e);
    });
});

app.get('/fetchunapproved/:id', function (req, res) {
    var userID = req.params.id.toString();
    var status = false;
    console.log(userID);
    Listing.find({
        userId: userID,
        approved_status: status
    }).then(function (listing) {
        res.send(listing);

    }).catch(function (e) {
        res.send(e);
    });
});

app.delete('/deleteListing/:id', function (req, res) {
    console.log(req.params.id);
    Listing.findByIdAndDelete(req.params.id).then(function (listing) {
        res.json( "Deleted Successfully")
    }).catch(function () {
        res.send(e);
    });
});

app.get('/fetchuser/:id', function (req, res) {
    var username = req.params.id.toString();
    console.log(username);
    User.find({
        username: username
    }).then(function (user) {
        res.send(user);

    }).catch(function (e) {
        res.send(e);
    });
});

//getting user data in user profile
app.get('/getUser/:id', function (req, res) {
    var id = req.params.id.toString();
    console.log(id);
    User.findById(id).then(function (user) {
    console.log(user);
        res.send(user);

    }).catch(function (e) {
        res.send(e);
    });
});

//update user details
app.put('/updateUser/:id', function (req, res) {
    user_id = req.params.id.toString();
    console.log(user_id);
    console.log(req.body);
    User.findByIdAndUpdate(user_id, req.body, {
        new: true
    }).then(function (user) {
        res.send(user);
    }).catch(function (e) {
        res.send(e);
    });
});

app.get('/mybookings/:username', function (req, res) {
    var username = req.params.username.toString();
    console.log(username);
    Listing.find({
        booked_by: username
    }).then(function (listing) {
        res.send(listing);

    }).catch(function (e) {
        res.send(e);
    });
});

app.post('/search', function (req, res) {
    var city = req.body.city;
    var price = req.body.price;
    var food_type = req.body.food_type;
    console.log(city);
   
    Listing.find({
        'city': new RegExp(city, 'i'),'booking_status':false,'approved_status':"",
        'price': new RegExp(price, 'i'),
        'food_type':new RegExp(food_type, 'i')

    }).then(function (listing) {
        res.send(listing);

    }).catch(function (e) {
        res.send(e);
    });
});

app.listen(8080);