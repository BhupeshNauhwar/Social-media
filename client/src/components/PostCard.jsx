import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom';
import {NoProfile} from '../assets/index'
import moment from 'moment';
import { AiFillLike } from 'react-icons/ai';
import {BiComment, BiLike} from 'react-icons/bi'
import { MdOutlineDelete } from 'react-icons/md';
import { useForm } from 'react-hook-form';


const CommentForm=({user,id,replyAt,getComments})=>{
    const [Loading,setLoading]=useState(false);
    const [errMsg,setErrMsg]=useState("");
    const {
        register,
        handleSubmit, 
        reset,
        formState:{errors},
    }=useForm({
      mode:"onChange"

    });

    const onSubmit=async(data)=>{}
    return(
        <form onSubmit={handleSubmit(onSubmit)} className='w-full border-b border-[#66666645]'>
            <div className='w-full items-center gap-2 py-4'>
                <img src={user?.profileUrl ?? NoProfile} alt="User Image"  
                className='w-10 h-10 roud-full object-cover'/>
            </div>
        </form>
    )
}

const PostCard = ({post,user,deletePost,likePost}) => {

    const [showAll, setShowAll]=useState(0);
    const [showReply, setShowReply]=useState(0);
    const [comments, setComments]=useState([]);
    const [loading, setLoading]=useState(false);
    const [replyComments, setReplyComments]=useState(0);
    const [showComments, setShowComments]=useState(0);



  return (
    <div className='mb-2 bg-primary p-4 rounded-xl'>
        <div className='flex gap-3 items-center mb-2'>
            <Link to={"/profile/"+post?.userId?._id}>

            <img 
                src={post?.userId?.profileUrl ?? NoProfile} 
                alt={post?.userId?.firstName} 
                className='w-10 h-10 object-cover rounded-full '
                        />

            </Link>

            <div className='w-full flex justify-between '>
            <div className=''>
                <Link
                 to={"/profile/"+post?.userId?._id}>
                    <p className='text-lg font-medium  text-ascent-1'>
                        {post?.userId?.firstName} {post?.userId?.lastName}
                    </p>
                </Link>   
                <span className='text-ascent-2'>{post?.userId?.location}</span>  
            </div>     
            <span className='text-ascent-2'>
                {moment(post?.createdAt ?? "2024-07-05").fromNow()}
            </span>
            </div>
        </div>
        <div>
            <p className='text-ascent-2'>
                 {showAll=== post?._id ? post?.description : post ?.description.slice(0,300)}

                {
                    post?.description?.length > 301 && (
                        showAll === post?._id ? ( <span className='text-blue ml-2 font-medium cursor-pointer' 
                        onClick={()=>setShowAll(0)}
                        >
                            Show Less
                            </span>
                            ):(
                            <span className='text-blue ml-2 font-medium cursor-pointer'
                             onClick={()=>setShowAll(post?._id)}
                             >
                                
                            Show More
                        </span>
                    ))
                }
            </p>

            {
                post?.image && (
                    <img 
                    src= {post?.image}
                    className='w-full mt-2 rounded-lg'
                    />
                )}
            </div>
            <div 
            className='mt-4 flex justify-between items-center px-3 py-2 text-ascent-2 text-base border-t border-[#66666645]'>
                <p className='flex gap-2 items-center text-base cursor-pointer'>
                    {
                        post?.likes?.includes(user?._id) ? (
                            <AiFillLike size={20} color='blue'/>
                        ):(
                            <BiLike size={20} />
                        )}

                        {post?.likes?.length }Likes

                </p>
               
                <p className='flex gap-2 items-center text-base cursor-pointer'>
                    <BiComment size={20} />
                    {post?.comments?.length} Comments
                </p>
                {
                    user?._id ===post?.userId?._id && <div className='flex gap-1 items-center text-base text-ascent-1 cursor-pointer
                     '>
                       <MdOutlineDelete size={20} />
                         <span>Delete</span>
                    </div>
                }
            </div>
        {/* comments */}
                {
                    showComments === post?._id && ( <div className='w-full mt-4 border-[#66666645] pt-4'>
                        <CommentForm 
                        user={user}
                        id={post?._id}
                        getComments={()=>getComments(post?._id)}
                        />
                    </div> )
                }
    </div>
  )}

export default PostCard
