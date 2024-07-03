import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { TbSocial } from 'react-icons/tb';
import TextInput from './TextInput';
import CustomButton from './CustomButton';
import { useForm } from 'react-hook-form';
import { BsMoon, BsSunFill } from 'react-icons/bs';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { setTheme } from "../redux/themeSlice";
// import { Logout } from "../redux/authSlice";

const TopBar = () => {
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const handleSearch = async (data) => {
    // Handle search logic here
  };

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";
    dispatch(setTheme(themeValue));
  };

  const handleLogout = () => {
    dispatch(Logout());
  };

  return (
    <div className='topbar w-full flex items-center justify-between py-3 md:py-6 px-4 bg-primary'>
      <Link to='/' className='flex gap-2 items-center'>
        <div className='p-1 md:p-2 bg-[#065ad8] rounded text-white'>
          <TbSocial />
        </div>
        <span className='text-xl md:text-2xl text-[#065ad8] font-semibold mr-1'>
          SocialMedia
        </span>
      </Link>

      <form className='flex items-center justify-center' onSubmit={handleSubmit(handleSearch)}>
        <TextInput
          placeholder='Search'
          styles='w-[18rem] lg:w-[38rem] rounded-1-full py-3'
          register={register("search")}
        />
        <CustomButton
          title={'Search'}
          type='submit'
          containerStyles='ml-0 bg-[#0444a4] text-white px-6 py-2.5 mt-2 rounded-r-full'
        />

        <div className='flex gap-4 items-center text-ascent-1 text-md md:text-xl ml-4'>
          <button onClick={handleTheme}>
            {theme ? <BsMoon /> : <BsSunFill />}
          </button>
          <div className='hidden lg:flex'>
            <IoMdNotificationsOutline />
          </div>
        </div>

        <CustomButton
          onClick={handleLogout}
          title={'Log Out'}
          containerStyles='ml-1 text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full'
        />
      </form>
    </div>
  );
};

export default TopBar;
