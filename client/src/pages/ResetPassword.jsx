import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import TextInput from '../components/TextInput';
import CustomButton from '../components/CustomButton';

const ResetPassword = () => {
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onChange" });

  const onSubmit = async (data) => {
    // Handle form submission
  };

  return (
    <div className='w-full h-[100vh] bg-bgColor flex items-center justify-center p-6'>
      <div className='bg-primary w-full md:w-1/3 2xl:w-1/4 px-6 py-8 shadow-md rounded-lg'>
        <p className='text-ascent-1 text-lg font-semibold'>Reset Password</p>
        <span className='text-sm text-ascent-2 mb-4'>Enter your registered email address to reset your password.</span>

        <form onSubmit={handleSubmit(onSubmit)} className=' py-4 flex flex-col gap-5'>
          <TextInput
            name="email"
            placeholder="Email Address"
            label="Email Address"
            type="email"
            register={register("email", { required: "Email Address is required" })}
            styles="rounded-full w-full"
            labelStyles='ml-2'
            error={errors.email ? errors.email.message : ""}
          />

          {errMsg && (
            <span className={`text-sm ${errMsg.status === "failed" ? "text-red-500" : "text-green-500"}`}>
              {errMsg.message}
            </span>
          )}

          {isSubmitting ? <Loading /> :
            <CustomButton
              type="submit"
              containerStyles='inline-flex justify-center rounded-md bg-blue px-8 py-3 font-medium text-white outline-none'
              title='Submit'
            />
          }
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
