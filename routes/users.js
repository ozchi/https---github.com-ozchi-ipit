var express = require('express');
const bcrypt = require('bcrypt');
// npm install bcrypt
const saltRounds = 10;  // 指定生成salt的复杂度
var router = express.Router();
const tokenManager = require('./tokenManager');


router.post('/reg', (req, res) => {

  const { email, password } = req.body;

  
  const query = "SELECT user_id FROM users WHERE email = ?";  

  req.pool.query(query, [email], (error, results) => {
      

      if (error) {
          
          res.status(500).json({ status: 'ERROR', message: 'Internal Server Error' });
          return;
      }

      if (results.length > 0) {
        
        res.json({ status: 'ERROR', message: "Email already registered." });
    } else {
        
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        console.log("reg, insert ", password, hashedPassword)
        const insertUserQuery = "INSERT INTO users (email, password) VALUES (?, ?)";

                
        req.pool.query(insertUserQuery, [email, hashedPassword], (insertError, insertResults) => {
            console.log("insert result----", insertError, insertResults);

            if (insertError) {
                res.status(500).json({ status: 'ERROR', message: 'Error while registering user.' });
                return;
            }
            
            
            res.json({ status: 'OK', user_id: insertResults.insertId });
        });
    }
  });
});




router.post('/login', (req, res) => {

  const { email, password } = req.body;

  
  const query = "SELECT user_id,email,password FROM users WHERE email = ?";  

  req.pool.query(query, [email], (error, results) => {
      if (error) {
          
          res.status(500).json({ status: 'ERROR', message: 'Internal Server Error' });
          return;
      }

      if (results.length > 0) {
          console.log(results)

          
          const hashedPassword = bcrypt.hashSync(password, saltRounds);
          console.log("login, fetch ", password, hashedPassword)
        
          fetch_password = results[0].password
          fetch_user_id = results[0].user_id
          fetch_email = results[0].email

          const isMatch = bcrypt.compareSync(password, fetch_password);

          if (isMatch) {           
            console.log("found", fetch_email, fetch_password, fetch_user_id);

            const token = tokenManager.generateToken();
            console.log("new token generated", token);
            tokenManager.storeToken(token, fetch_user_id);        
            res.cookie('userToken', token, { maxAge: 900000, httpOnly: true });

            res.json({ status: 'OK', user_id: fetch_user_id });
          } else {
            res.status(401).json({ status: 'ERROR', message: 'password incorrect' });
          }
      } else {
          
          console.log("not found");
          res.status(401).json({ status: 'ERROR', message: 'User not found' });
      }
  });
});

module.exports = router;