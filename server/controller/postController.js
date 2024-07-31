import Posts from '../models/postModels.js'
import Users from '../models/userModel.js';
import Comments from '../models/commentsModels.js'

export const createPost=async(req,res,next )=>{
    try {
        const {userId}=req.body.user;
        const {description,image}=req.body;

        if (!description) {
            next("You must provide a description");
            return;
        }
       
        const post=await Posts.create({
            userId,
            description,
            image
        });
        res.status(200).json({
            sucess:true,
            message:"Post created successfully",
            data:post,
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({message:error.message})
    }
}

export const getPosts=async(req,res,next)=>{
    try {
        const {userId}=req.body.user;
        const {search}=req.body;

        const user =await Users.findById(userId);
        const friends=user?.friends?.toString().split(",")?? [];
        friends.push(userId);

        const searchPostQuery={
            $or:[
                {
                    description:{$regex:search,$options:"i"},
                }
            ]
        }
        const posts=await Posts.find(search ?searchPostQuery :{}).populate({
            path:"userId",
            select:"firstName lastName location profileUrl -password",
        }).sort({_id:-1});

        const friendsPosts=posts?.filter((post)=>{
            return friends.includes(post?.userId?._id.toString());
        })
        const otherPosts=posts?.filter((post)=>
            !friends.includes(post?.userId._id.toString())
        )
        let postsRes=null;

        if(friendsPosts?.length>0){
            postsRes=search ? friendsPosts : [...friendsPosts, ...otherPosts];
        }else{
            postsRes=posts;
        }

        res.status(200).json({
            sucess:true,
            message:"successfully",
            data:postsRes
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({message:error.message});
    }
}

export const getPost=async(req,res,next)=>{
    try {
        const {id}=req.params;
        
        const post=await Posts.findById(id).populate({
            path:"userId",
            select:"firstName lastName location profileUrl -password",
        })
        
        
        res.status(200).json({
            sucess:true,
            message:"successfully",
            data:post,
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({message:error.message});
    }
}


export const getUserPost=async(req,res)=>{
    try {
        const {id}=req.params;
        
        const post=await Posts.find({userId:id}).populate({
            path:"userId",
            select:"firstNmae lastName location profileUrl -password",
        })
        .sort({_id:-1});
        
        res.status(200).json({
            sucess:true,
            message:"successfully",
            data:post,
        })
        
    } catch (error) {
        console.log(error);
        res.status(404).json({message:error.message});
    }
}


export const getComments=async(req,res,next)=>{
    try {
        const {postId}=req.params;
        
        const postComments=await Comments.find({postId})
        .populate({
            path:"userId",
            select:"firstName lastName location profileUrl -password",
        })
        .populate({
            path:"replies.userId",
            select:"firstName lastName location profileUrl -password",
        })
        .sort({_id:-1});

        res.status(200).json({
            sucess:true,
            message:"successfully",
            data:postComments,

        });
    } catch (error) {
        console.log(error);
        res.status(404).json({message:error.message});
    }
}

export const likePost=async(req,res,next)=>{
    try {
        const {userId}=req.body.user;
        const {id}=req.params;

        const post =await Posts.findById(id);

        const index=post.likes.findIndex((pid)=>pid === String(userId));

        if (index ===-1) {
            post.likes.push(userId);
        }
        else{
            post.likes=post.likes.filter((pid)=> pid !== String(userId));
        }
        const newPost= await Posts.findByIdAndUpdate(id ,post,{
            new:true
        })
        res.status(200).json({
            sucess:true,
            message:"successfully",
            data:newPost,

        });
    } catch (error) {
        console.log(error);
        res.status(404).json({message:error.message});
    }
}
export const likePostComment = async (req, res, next) => {
    const { userId } = req.body.user;
    const { id, rid } = req.params;

    try {
        if (!rid) { // Handle top-level comments
            const comment = await Comments.findById(id);
            const userIdStr = String(userId);

            const index = comment.likes.indexOf(userIdStr);
            if (index === -1) {
                comment.likes.push(userIdStr);
            } else {
                comment.likes = comment.likes.filter(i => i !== userIdStr);
            }

            const updatedComment = await Comments.findByIdAndUpdate(id, { likes: comment.likes }, { new: true });
            res.status(201).json(updatedComment);
        } else { // Handle reply comments
            const replyComment = await Comments.findOne(
                { _id: id, 'replies._id': rid },
                { 'replies.$': 1 } // Use $ to return the matched reply
            );

            if (!replyComment || !replyComment.replies || replyComment.replies.length === 0) {
                return res.status(404).json({ message: 'Reply not found' });
            }

            const reply = replyComment.replies[0];
            const userIdStr = String(userId);

            const index = reply.likes.indexOf(userIdStr);
            if (index === -1) {
                reply.likes.push(userIdStr);
            } else {
                reply.likes = reply.likes.filter(i => i !== userIdStr);
            }

            const result = await Comments.updateOne(
                { _id: id, 'replies._id': rid },
                { $set: { 'replies.$.likes': reply.likes } }
            );

            res.status(201).json(result);
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};



export const commentPost=async(req,res,next)=>{
    try {
        const {comment,from}=req.body;
        const {userId}=req.body.user;
        const {id}=req.params;
        if (comment === null) {
            res.status(404).json({message:"Comment is required"});
        }
        
        const newComment=new Comments({comment ,from ,userId,postId:id});

        await newComment.save();

        const post =await Posts.findById(id);

        post.comments.push(newComment._id);
        
        const updatedPost = await Posts.findOneAndUpdate(
            { _id: id }, 
            { $set: { comments: post.comments } }, 
            { new: true }
        );
        
        res.status(201).json(newComment);
    } catch (error) {
        console.log(error);
        res.status(404).json({message:error.message});
    }
}

export const replyPostComment=async(req,res,next)=>{
    const {userId}=req.body.user;
    const {comment,replyAt,from}=req.body;
    const {id}=req.params;

    if (comment ===null) {
        res.status(404).json({message:"Comment is required"});
    }
    try {
        const commentInfo=await Comments.findById(id);

        commentInfo.replies.push({
            comment,
            replyAt,
            from,
            userId,
            created_At:Date.now(),
        })
        
        commentInfo.save();

        res.status(200).json(commentInfo);
    } catch (error) {
        console.log(error);
        res.status(404).json({message:error.message});
    }
}


export const deletePost=async(req,res,next)=>{
    try {
        const {id}=req.params;

        await Posts.findOneAndDelete(id);

        res.status(200).json({
            sucess:true,
            message:"Deleted Successfully",
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({message:error.message});
    }
}