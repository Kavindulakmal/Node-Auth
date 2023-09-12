const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");



const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});




exports.register = (req, res)=>{
    console.log(req.body);


    const {name, email, password, passwordConfirm} =req.body;

    db.query('SELECT email FROM users WHERE email = ?',[email], async (error,results)=>{
        if(error){
            console.log(error);
        }
        if(results.length > 0){
            return results.render('register',{
                message: 'that email has been taken'
            })
        }else if (password !== passwordConfirm){
            return results.render('register',{
                message: 'password do not match'
            });
        }

        let hashedpassword = await bcrypt.hash(password,8);
        console.log(hashedpassword);

        db.query('INSERT INTO users SET ?',{name: name, email:email, password:hashedpassword},(error,results)=>{
            if (error) {
                console.log(error);
            }else{
                console.log(results);
                return results.render('register',{
                    message: 'user registered successfully'
                });
            }
        })
    } );




}