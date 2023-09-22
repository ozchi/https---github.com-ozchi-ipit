var express = require('express');
const bcrypt = require('bcrypt');
// npm install bcrypt
const saltRounds = 10;  // 指定生成salt的复杂度
var router = express.Router();
const tokenManager = require('./tokenManager');

// 注册新用户
router.post('/reg', (req, res) => {

  const { email, password } = req.body;

  // 你的数据库查询代码（这里仅作为示例，可能需要调整以适应你的实际数据库和查询）
  const query = "SELECT user_id FROM users WHERE email = ?";  // 注意：这是一个简化示例，实际生产中不应明文存储密码！

  req.pool.query(query, [email], (error, results) => {
      

      if (error) {
          // 查询出错，你可以在此处理错误
          res.status(500).json({ status: 'ERROR', message: 'Internal Server Error' });
          return;
      }

      if (results.length > 0) {
        // 找到匹配的用户，说明该邮箱已经被注册了
        res.json({ status: 'ERROR', message: "Email already registered." });
    } else {
        // 未找到匹配的邮箱，执行插入新用户的操作
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        console.log("reg, insert ", password, hashedPassword)
        const insertUserQuery = "INSERT INTO users (email, password) VALUES (?, ?)";

                
        req.pool.query(insertUserQuery, [email, hashedPassword], (insertError, insertResults) => {
            console.log("insert result----", insertError, insertResults);

            if (insertError) {
                res.status(500).json({ status: 'ERROR', message: 'Error while registering user.' });
                return;
            }
            
            // 返回新用户的user_id
            res.json({ status: 'OK', user_id: insertResults.insertId });
        });
    }
  });
});



// 老用户登录
router.post('/login', (req, res) => {

  const { email, password } = req.body;

  // 你的数据库查询代码（这里仅作为示例，可能需要调整以适应你的实际数据库和查询）
  const query = "SELECT user_id,email,password FROM users WHERE email = ?";  // 注意：这是一个简化示例，实际生产中不应明文存储密码！

  req.pool.query(query, [email], (error, results) => {
      if (error) {
          // 查询出错，你可以在此处理错误
          res.status(500).json({ status: 'ERROR', message: 'Internal Server Error' });
          return;
      }

      if (results.length > 0) {
          console.log(results)

          // 找到匹配的用户，返回user_id
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
          // 未找到匹配的用户，返回错误信息
          console.log("not found");
          res.status(401).json({ status: 'ERROR', message: 'User not found' });
      }
  });
});

module.exports = router;