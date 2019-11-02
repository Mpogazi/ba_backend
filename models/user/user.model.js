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

userSchema.pre('save', function (next) {
    if (!this.creationDate) this.creationDate = new Date();
    // Hash the password only if it has been modified(or is new)
    if (!this.isModified('password')) {
        return next(); 
    }

    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) return next(err);
            this.password = hash;
            next();
        });
    });
});

userSchema.methods.incLoginAttempts = function (cb) {
    // Have previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $set: { loginAttempts: 1},
            $unset: { lockUntil : 1 }
        }, cb);
    }
    // Increment
    var updates = { $inc: { loginAttempts: 1 } };
    // lock the account if we've reached the attempts limit
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + LOCK_TIME };
    }

    return this.updateOne(updates, cb);
};

// exposing enum to the model, and providing the reference.
var reasons = userSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
};

userSchema.statics.getAuthenticated = function (email, passwd, cb) {
    this.findOne({ email: email }, function (err, user) {
        if (err) return cb(err);

        if (!user) return cb(null, null, reasons.NOT_FOUND);

        // Check if the account is locked && incLoginAttempts
        if (!!(user.lockUntil && user.lockUntil > Date.now())) {
            return user.incLoginAttempts(function (err) {
                if (err) return cb(err);
                return cb(null, null, reasons.MAX_ATTEMPTS);
            });
        }

        // Compare passwords if the account is not locked
        bcrypt.compare(passwd, user.password, function(err, isMatch) {
            if (err) return cb(err);
            if (isMatch) {
                if (!user.loginAttempts && !user.lockUntil) {
                    return cb(null, user);
                }
                // reset attempts and lock info
                var updates = {
                    $set: { loginAttempts: 0 },
                    $unset: { lockUntil: 1 }
                };

                return user.update(updates, function (err) {
                    if (err) return cb(err);
                    return cb(null, user);
                });
            }

            // password is incorrect, so increment login attempts before response
            user.incLoginAttempts(function (err) {
                if (err) {
                    return cb(err); 
                }
                return cb(null, null, reasons.PASSWORD_INCORRECT);
            });
        });
    });
}


// Exporting the module 
const User = mongoose.model('User', userSchema);
exports.User = User;
exports.FailReason = reasons;