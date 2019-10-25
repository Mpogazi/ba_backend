var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_FACTOR = 10;

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

userSchema.pre('save', (next) => {
    var user = this;
    if (!user.creationDate) user.creationDate = new Date();
    
    // Hash the password only if it has been modified(or is new)
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
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
}

// Create a model using schema
const User = mongoose.model('User', userSchema);

// Making the model available
exports.User = User;