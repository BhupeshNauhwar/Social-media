import React from 'react'
import {NoProfile} from '../assets/index'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { updateProfile } from '../redux/userSlice'
import {LiaEditSolid} from 'react-icons/lia'
import {BsBriefcase, BsPersonFillAdd ,BsFacebook, BsInstagram} from 'react-icons/bs'
import { CiLocationOn} from 'react-icons/ci'
import moment from'moment'
import {FaTwitterSquare} from 'react-icons/fa'
const ProfileCard = ({user}) => {
    const {user:data,edit}=useSelector((state)=>state.user)
    const dispatch=useDispatch();
    const isMobile=window.innerWidth < "900px";
  return (
    <div>
        <div className='w-full bg-primary flex flex-col items-center shadow-sm rounded-xl px-6 py-4' >

        <div className="w-full flex items-center justify-between border-b pb-5 border-[#66666645]">
            <Link to={'/profile/'+user?._id} className='flex gap-2' >
            <img src={user?.profileUrl ?? NoProfile} alt={user?.email}  className='w-14 h-14 object-cover rounded-full'/>
            <div className='flex flex-col justify-center'>
                <p className='text-lg font-medium text-ascent-1'>{user?.firstName} {user?.LastName}</p>
                <span className='text-ascent-2'>{user?.profession ?? "No Profession"}</span>
            </div>
            </Link>

            <div className=''>
              {user?._id===data?._id ? (
                 <LiaEditSolid
                size={22}
                className='text-blue cursor-pointer'
                onClick={()=>dispatch(updateProfile(true))}
                
           /> ):(
            <button className='bg-[#04441430] text-sm text-white p-1 rounded'
            onClick={()=>{}}>
              <BsPersonFillAdd size={20} className='text-[#0f52b6]'/>
            </button>
            )}
            </div>
        </div>
            <div className='w-full glex fle-col gap-2 py-4 border-b border-[#66666645]' style={isMobile?{fontSize:"10px"}:{}}>
              <div className='flex  items-center text-ascent-2' >
                <CiLocationOn className='text-sm text-ascent-1'/>
                <span>{user?.location ?? "Add Location"}</span>
                </div>
               <div className='flex gap-2 items-center text-ascent-2'>
                <BsBriefcase className= 'text-sm text-ascent-1'/>
                <span>{user?.profession??"Add Profession"}</span>
                </div> 
              <div className='w-full glex fle-col gap-2 py-4 border-b border-[#66666645]'>
                <p className='text-xl text-ascent-1 font-semibold'>{user?.friends?.length} Friends</p>
                <div className='flex items-center justify-between'>
                  <span className='text-ascent-2'>Who viewed your profile</span>
                  <span className='text-ascent-1 text-lg'>{user?.views?.length}</span>
                </div>

                <span className='text-base text-blue'>
                  {user?.verified? "Verified Account":"Not verified"}
                </span>

                <div className='flex items-center justify-between'> 
                  <span className='text-ascent-2 '>Joined</span>
                  <span className='text-ascent-1 text-base'>{moment(user?.createdAt).fromNow()}

                  </span>
                </div>
              </div>
              <div className='w-full flex flex-col gap-4 py-4 pb-6 '>
                <p className='text-ascent-1 text-lg font-semibold'>Social Profile</p>
                
                <div className='flex gap-2 items-center text-ascent-2'>

                  <BsInstagram className='text-sm text-ascent-1' />

                  <span>Instagram</span>

                </div>

                <div className='flex gap-2 items-center text-ascent-2'>

                  <FaTwitterSquare className=' text-sm text-ascent-1' />

                  <span>Twitter</span>

                </div>

                <div className='flex gap-2 items-center text-ascent-2'>

                  <BsFacebook className=' text-sm text-ascent-1' />

                  <span>Facebook</span>

                </div>

                </div>
            </div>
    </div>
    </div>
  )
}
// 1:42
export default ProfileCard
