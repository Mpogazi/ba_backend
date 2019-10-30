var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_FACTOR = 10,
    MAX_LOGIN_ATTEMPTS = 6,
    LOCK_TIME = 2 * 60 * 60 * 1000;

let userSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, minlength: 6, index: { unique: true } },
    contactNo: { type: String, required: false, minlength: 10 },
    creationDate: { type: Date, required: true },
    password: { type: String, minlength: 6, required: true },
    loginAttempts: { type: Number, required: true,  default: 0 },
    lockUntil: { type: Number },
    permissions: { type: String, required: true }
});

userSchema.virtual('isLocked').get(function () {
    // check for a future lockUntil timestamp
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.pre('save', function (next) {
    var user = this;
    if (!user.creationDate) user.creationDate = new Date();
    
    // Hash the password only if it has been modified(or is new)
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = (candidatePassword, cb) => {
    bcrypt.compare(candidatePassword, this.password, (err, isMacth) => {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.methods.incLoginAttempts = function (cb) {
    // Have previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.update({
            $set: { loginAttempts: 1},
            $unset: { lockUntil : 1 }
        }, cb);
    }
    // Increment
    var updates = { $inc: { loginAttempts: 1 } };
    // lock the account if we've reached the attempts limit
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        update.$set = { lockUntil: Date.now() + LOCK_TIME };
    }

    return this.update(updates, cb);
};

// exposing enum to the model, and providing the reference.
var reasons = userSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
};

userSchema.statics.getAuthenticated = function (username, password, cb) {
    this.findOne({ name: username }, function (err, user) {
        if (err) return cb(err);

        // make sure the user exists
        if (!user) return cb(null, null, reasons.NOT_FOUND);

        // Check if the account is locked
        if (user.isLocked) {
            return user.incLoginAttempts(function (err) {
                if (err) return cb(err);
                return cb(null, null, reasons.MAX_ATTEMPTS);
            });
        }

        // test for a matching password
        user.comparePassword(password, function (err, isMatch) {
            if (err) return cb(err);


            // check if the match is returned
            if (isMatch) {
                // if there's no lock or failed attempts, just retun the user
                if (!user.loginAttempts && !user.lockUntil) {
                    return cb(null, user);
                }
                // reset attempts and lock info
                var updates = {
                    $set: { loginAttempts: 0},
                    $unset: { lockUntil: 1}
                };

                return user.update(updates, function (err) {
                    if (err) return cb(err);
                    return cb(null, user);
                });
            }

            // password is incorrect, so increment login attempts before response
            user.incLoginAttempts(function (err) {
                if (err) return cb(err);
                return cb(null, null, reasons.PASSWORD_INCORRECT);
            });
        });
    });
}


// Exporting the module 
const User = mongoose.model('User', userSchema);
exports.User = User;