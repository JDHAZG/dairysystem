
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const UserType={
    username:String,
    password:String,
    password2:String 
}
const ArticleType={
    title:String,
    content:String,
    id:Number,
    username: String
}
const UserModel=mongoose.model("user",new Schema(UserType));
const ArticleModel=mongoose.model("article",new Schema(ArticleType));
// 模型user 将会对应users 集合
module.exports={UserModel,ArticleModel};