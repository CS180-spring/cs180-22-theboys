const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {StatusCodes} = require('http-status-codes')
require('dotenv').config();

const Pool = require('pg').Pool;
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
})


const Login = async(req, res)=> {
    const {email, password} = req.body;

    if(!email || !password)
    {
        throw new Error('Please provide an email and password');
    }
    const user = await CheckForEmail(email);
    if(!user)
    {
        throw new Error(`No user found with email ${email}`);
    }

    const match = await bcrypt.compare(password, user.password);
    if(!match)
    {
        return res.status(StatusCodes.UNAUTHORIZED).send('Invalid Password');
    }

    const token = await CreateJWT(user);
    user.token = token;
    res.status(200).json(user);

}


const Register = async(req, res)=> {
    const {
        email, 
        username, 
        password
    } = req.body;

    if(!email || !username || !password)
    {
        throw new Error("Please provide a username, email, and password");
    }
    let user  = await CheckForEmail(email);
    if(user)
    {
        throw new Error(`User already exists with email ${email}`);
    }

    //Generate the salt and hash the password before storing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    try{
        const result = await pool.query(`INSERT INTO users (
            userName,
            userPassword,
            userEmail,
            userIsTempUser
        )
        VALUES (
            $1,
            $2,
            $3,
            $4
        ) RETURNING *`,
        [username, hashedPassword, email, false])

        user = result.rows[0];
        const token = await CreateJWT(user);
        user.token = token;
        res.status(200).json(user);
    }
    catch(err)
    {
        throw err;
    }    
}

//Checks for existing email in database
const CheckForEmail = async(email) =>
{
    try{
        const {rows} = await pool.query(
            `SELECT * FROM users WHERE userEmail = $1`,
            [email]
        )
        const user = rows[0];
        if(!user)
        {
            return null;
        }
    
        return user;
    }
    catch(err)
    {
        throw err;
    }
}

module.exports = {
    Login,
    Register
}

const CreateJWT = async (user) => {
    return jwt.sign({
        userId: user.id,
        name: user.username
    },
    process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_LIFETIME
    }
    )
}