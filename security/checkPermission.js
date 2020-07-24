
const getUserRoles = require('./../user/roles');

module.exports = function permit(...allowed) {
    return (req, res, next) => {
        getUserRoles(req.user.sub).then(result => {
            for(const role of result){
                if (allowed.includes(role.name)){
                    next();
                    return;
                }
            }
            res.status(401).json({message: `no permission for ${req.originalUrl}`});
        }).catch(err=>{
            res.status(500).json(err);
        });
    }

}