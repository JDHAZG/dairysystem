var express = require('express');
const {UserModel} = require('../model/UserModel');
var router = express.Router();
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//注册
router.post('/regist',function(req,res,next){
  var data={
    username: req.body.username,
    password: req.body.password,
    password2: req.body.password2
  } 
  UserModel.find({username:data.username}).then((item) => { 
    if(item.length>=1){
      // window.alert('该账号已经有人注册了，请换一个用户名');
      res.send('该账号已经有人注册了，请返回注册页，换一个用户名')
      res.redirect('/regist');
    }else{
      UserModel.create(data).then((item) => { 
        console.log(item);
        res.redirect('/login');
       }).catch((error) => { 
         console.log('注册失败');
         res.redirect('/regist');
        })
    }
   })
})

// 登录接口
router.post('/login',function(req,res,next){
  var data={
    username: req.body.username,
    password: req.body.password
  }
  UserModel.find(data).then((item) => { 
    if(item.length>0){
      //登录成功进行session会话存储
      req.session.username=data.username
      res.redirect('/');
    }else{
      // res.send('用户名或密码错误');
      res.redirect('/login');
    }
   }).catch((error) => { 
     res.redirect('/login');
    })
})

//退出登录
router.get('/logout',function(req,res,next){
  req.session.username=null;
  res.redirect('/login');
})

module.exports = router;
