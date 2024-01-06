
const User=require("../../../models/user");
const jwt=require('jsonwebtoken');

module.exports.createSession=async function(req,res){
    try {
        let user = await User.findOne({ email: req.body.email }).exec();
    
        if (!user || req.body.password !== user.password) {
            return res.json(422, {
                message: "Invalid Username or Password",
            });
        }
    
        return res.json(200, {
            message: "Sign in successfully, here is the token. Please keep it safe!",
            data: {
                // Here we are creating the token in H_____P_______S form
                // Use the same encrypted key used in passport-jwt for decryption
                // Because the use of passport-jwt is for decryption
                // and the use of jsonwebtoken is to create the token
                token: jwt.sign(user.toJSON(), 'codial', { expiresIn: '1000000' }),
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}
