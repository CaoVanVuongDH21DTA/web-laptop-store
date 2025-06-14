import React from 'react'

const SectionHeading = ({title}) => {
  return (
    <div className='flex flex-wrap px-4 md:px-10 my-5 items-center gap-2'>
        <div className='border rounded bg-black w-2 h-10'></div>
        <p className='text-xl md:text-2xl font-semibold'>{title}</p>
    </div>
  );
};

export default SectionHeading;
