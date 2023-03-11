var express = require('express');
const moment = require('moment');
const { ArticleModel } = require('../model/UserModel');
var router = express.Router();
// var model =require('../model/UserModel');

router.get('/', function(req, res, next) {
  var username=req.session.username;
  var page=req.query.page || 1
  var data={
    total:0,//总共有多少页
    curpage:page,
    list:[]
  }
  var pageSize=2;
  //1.查询所有文章
  ArticleModel.find({username:username}).then((item) => { 
    
    data.total=Math.ceil(item.length/pageSize);
    //2.查询当前页的文章列表
    if(item.length)
    ArticleModel.find({username:username}).sort({id:-1}).skip((page-1)*pageSize).limit(pageSize).then((item1) => { 
      var list=item1;
      if(list.length===0){
          res.redirect('/?page='+((page-1)||1))
      }else{
        list.map(function(val,index){
          val['time']=moment(val.id).format('YYYY-MM-DD HH:mm:ss');
        })
      }
      data.list=list;
      res.render('index', { username:username ,data:data});
     })
     else{
      res.render('nodata',{ username:username})
     }
   })
});

//渲染注册页面
router.get('/regist',function(req,res,next){
  res.render('regist',{});
})

//渲染登录页面
router.get('/login',function(req,res,next){
    res.render('login',{});
})

//渲染写文章页面
router.get('/write',function(req,res,next){
  var username=req.session.username ||'';
  var id=parseInt(req.query.id);
  var page=req.query.page;
  var item={
    title:'',
    content:''
  }
  if(id){ //编辑
    ArticleModel.find({id:id}).then((val) => { 
      console.log('查询成功')
      item=val[0];
      item['page']=page;
      res.render('write',{username:username,item:item})
    }).catch((error) => { 
      console.log('查询失败');
     })
  }else{ //新增
    res.render('write',{username:username,item:item})
  }
})

//渲染详情页面
router.get('/detail',function(req,res,next){
  var username=req.session.username || '';
  var id=parseInt(req.query.id);
  ArticleModel.find({id:id}).then((val) => { 
    var item =val[0];
    item['time']=moment(item.id).format('YYYY-MM-DD HH:mm:ss')
    res.render('detail',{item:item,username:username});
   }).catch((error) => { 
     console.log('查询失败');  
    })
})

module.exports = router;
