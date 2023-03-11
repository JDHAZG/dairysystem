var express = require('express');
const {ArticleModel} = require('../model/UserModel');
var router = express.Router();
var multiparty=require('multiparty');
var fs=require('fs');
/* GET users listing. */
router.post('/add',function(req,res,next){
    var id=parseInt(req.body.id)
    if(id){//编辑
        var page=req.body.page;
        var title=req.body.title;
        var content=req.body.content;
        ArticleModel.updateOne({id:id},{title:title,content:content}).then((item) => { 
            console.log('修改成功')
            res.redirect('/?page='+page);
         }).catch((error) => { 
             console.log('修改失败',error);
          })
    }else{//新增
        var data={
            title: req.body.title,
            content: req.body.content,
            id:Date.now(),
            username: req.session.username
        }
        ArticleModel.create(data).then((item) => { 
            res.redirect('/');
         }).catch((error) => { 
             console.log('文件发布失败',error)
             res.redirect('/write');
          }) 
    }
    
})

//删除文章
router.get('/delete',function(req,res,next){
    var id=parseInt(req.query.id);
    var page=req.query.page;
    ArticleModel.deleteOne({id:id}).then((item) => { 
        console.log('删除成功');
        res.redirect('/?page='+page);
     }).catch((error) => { 
         console.log('删除失败');
         res.redirect('/?page='+page);
      })
})

router.post('/upload',function(req,res,next){
    var form=new multiparty.Form();
    form.parse(req,function(err,fields,files){
        if(err){
            console.log('上传失败',err);
        }else{
            console.log('文件列表',files)
            var file=files.filedata[0]
            var rs=fs.createReadStream(file.path);
            var newPath='/uploads/'+file.originalFilename
            var ws=fs.createWriteStream('./public'+newPath);
            rs.pipe(ws);
            ws.on('close',function(){
                console.log('文件上传成功')
                res.send({err:'',msg:newPath});
            })
        }
    })
})
module.exports = router;
