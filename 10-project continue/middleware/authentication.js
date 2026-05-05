const auth = (req, res, next)=>{
    const token = "abcd";
    const access = token === "abcd";

    if(!access) res.status(403).send('no permission');
    else next();
};

module.exports = {auth};