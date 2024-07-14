import React from 'react';
import { useSelector } from 'react-redux';
import { TopBar, ProfileCard  ,FriendsCard, TextInput,PostCard, EditProfile,} from '../components/input';
import { useForm } from 'react-hook-form';

import { Link } from 'react-router-dom'
import {suggest,requests,posts} from '../assets/data'
import { useState } from 'react';
import {NoProfile} from '../assets/index'
import CustomButton from '../components/CustomButton';
import { BsPersonFillAdd } from 'react-icons/bs';
import { BiImages, BiSolidVideo } from 'react-icons/bi';
import {Loading} from '../components/input'
import { MdGif } from 'react-icons/md';
const Home = () => {
  const { user ,edit } = useSelector(state => state.user);
  const [friendRequest ,setFriendRequest]=useState(requests);
  const [suggestedFriends ,setSuggestedFriends]=useState(suggest);
  const [errMsg ,setErrrMsg]=useState("");

  const [file,setFile]=useState(null)
  const [posting,setPosting]=useState(false)
  const [loading,setLoding]=useState(false)

  const {register,handleSubmit,formState:{errors}}=useForm();

 


  const handlePostSubmit=async(data)=>{


  }


  return (
    <>
       <div className='home w-full px-4 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
      <TopBar />

      <div className='w-full flex flex-col lg:flex-row gap-4 pt-5 pb-10 h-full'>
        {/* Left */}
        <div className=' lg:flex w-1/4 flex-col gap-6 overflow-y-auto'>
          <ProfileCard user={user} />
          <FriendsCard friends={user?.friends}/>
        </div>

        {/* Center */}
        <div className=' flex-1 h-full  flex px-4 flex-col gap-6 overflow-y-auto'>

          <form className='bg-primary px-6 rounded-lg'
          onSubmit={handleSubmit(handlePostSubmit)}
          >
            <div className=' w-full flex items-center gap-2 py-4 border-b border-[#66666645]' >
                  <img 
                    src={user?.profileUrl ?? NoProfile} 
                    alt='User Image' 
                    className='w-10 h-10 object-cover rounded-full '
                  />
                  <TextInput 
                  styles='w-full rounded-full py-5'
                  placeholder="What's on your mind.."
                  name='description'
                  register={register("description",{
                    required: "Write something about post",
                  })}
                  error={errors.description ? errors.description.message:""}
            
                  />
            </div>
            {
                errMsg?.message && (
                  <span className={`text-sm ${
                    errMsg?.status=="failed" ? "text-[#f64949fe]":"text-[#2ba150fe]"

                  }`}>
                    {errMsg?.message}
                  </span>
                )
              }
              <div className='flex items-center justify-between py-4'>
                <label htmlFor="imgUpload" 
                className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'>
                  <input 
                  type="file" 
                  onChange={(e)=>setFile(e.target.files[0])}

                  className='hidden'
                  id='imgUpload'
                  data-max-size='5120'
                  accept='.jpeg,.jpg,.png'/>
                  <BiImages/>
                  <span>Image</span>
                </label>
                 
                 <label 
                 className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                 htmlFor="videoUpload" >
                 <input type="file"
                 className='hidden'
                 data-max-size='5120'
                 onChange={(e)=>{e.target.files[0]}}
                 id='videoUpload'
                 accept='.mb4, .wav'
                 />
                
                  <BiSolidVideo/>
                  <span>video</span>
                 </label>

                 <label 
                 className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                 htmlFor="videoUpload" >
                 <input type="file"
                 className='hidden'
                 data-max-size='5120'
                 onChange={(e)=>{e.target.files[0]}}
                 id='vgifUpload'
                 accept='.gif'
                 />
                
                  < MdGif  />
                  <span>Gif</span>
                 </label>

                <div className=''> 
                  {posting? (
                  <Loading/>
                ):(
                  <CustomButton
                  type='submit'
                  title='Post'
                  containerStyles='bg-[#0444a4] text-white py-1 px-6 rounded-full font-semibold text-sm' 
                  />
                )} </div>
              </div>

          </form>
                {loading ?(<Loading/>):posts?.length>0 ?(
                  posts?.map((post)=>(
                  <PostCard key={post?._id} post={post}
                    user={user}
                    delete={()=>{}}
                    likePost={()=>{}}

                  />
                ))
                ):(
                  <div className='flex w-full items-center justify-center '>
                  <p className='text-lg text-ascent-2'>No Post Available</p>
                  </div>
                )

                }
        </div>

        {/* Right */}
        <div className='hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto' >
          {/* friend request */}
          <div className='w-fll bg-primary shadow-sm rounded-lg px-6 py-5'>
            <div className='flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]'>
              <span> Friend Request</span>
              <span> {friendRequest?.length}</span>
            </div>
            <div className='w-full flex flex-col gap-4 pt-4'>
              {
                friendRequest?.map(({_id,requestFrom:from})=>(
                  <div 
                  key={_id}
                  className='flex items-center justify-between'
                  >
                    <Link 
                    to={"/profile/"+from._id}
                    className="w-full flex gap=4 items-center cursor-pointer
                    "
                    >
                      
                    <img 
                    src={from?.profileUrl ?? NoProfile} 
                    alt={from?.firstName} 
                    className='w-10 h-10 object-cover rounded-full '
                    />
                    <div className='flex-1 ml-2'>
                      <p className='text-base font-medium text-ascent-1 '>     {from?.firstName} {from?.lastName}</p>
                      <span className='text-sm text-ascent-2'>
                        {from?.profession ?? "No Profession"}
                      </span>
                    </div>
                    </Link>
                    <div className='flex gap-1'>
                      <CustomButton 
                      title='Accept'
                      containerStyles='bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full'
                      />
                      <CustomButton 
                      title='Deny'
                      containerStyles='border border-[#666] text-xs text-white px-1.5 py-1 rounded-full'
                      />
                    </div>
                  </div>
                ))
              }
              </div>
          </div>
          {/* suggested */}
          <div className='w-full bg-primary shadow-sm rounded-lg px-5 py-5'>
                <div className='flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645]'>
                  <span>Friend Suggestion </span>
                </div>
                <div className='w-full flex flex-col gap-4  pt-4'>
                  {
                    suggestedFriends?.map((friend)=>(
                      <div 
                      className='flex items-center justify-between'
                       kye={friend._id}>
                        <Link to={"/profiel/"+friend?._id} className='w-full flex gap-4 items-center cursor-pointer'>
                        <img 
                          src={friend?.profileUrl ?? NoProfile} 
                          alt={friend?.firstName} 
                          className='w-10 h-10 object-cover rounded-full '
                        />
                        <div className='flex-1'>
                        <p className='text-base font-medium  text-ascent-1'>
                        {friend?.firstName} {friend?.lastName} 
                        </p>
                        <p className='text- sm text-ascent-2'>
                        {friend?.profession ?? "No Profession"} 
                        </p>
                    </div>
                    
                        </Link>

                        <div className='flex gap-1'>
                          <button className='bg-[#04441430] text-sm text-white p-1 rounded'
                          onClick={()=>{}}
                          >
                            <BsPersonFillAdd size={20} className='text-[#0f52b6]'/>
                          </button>
                        </div>
                      </div>
                    ))
                  }
                </div>
          </div>
        </div>
      </div>
    </div>
    {edit && <EditProfile />}
    </>
  );
};

export default Home;
