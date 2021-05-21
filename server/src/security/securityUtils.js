const bcrypt = require('bcrypt');

const encode = async (password) => {
    return await bcrypt.hashSync(password, +process.env.SALTROUNDS);
}

const compare = async (password,hash) => {
    return await bcrypt.compareSync(password,hash)
}


module.exports = {
    encode,
    compare
}