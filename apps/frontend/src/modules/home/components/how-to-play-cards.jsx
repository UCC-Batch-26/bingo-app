function HowToPlayCards({type, description}) {
    return ( 
        <div className="w-[80%] h-[200px] bg-[#F9F9F9] border-[2px] border-[#9B17F8] text-[#000] flex justify-between items-start flex-col p-[15px]">
              <p className='font-[700]'>
                As a {type}:
              </p>
              <p className='text-[14px]'>
                {description}
              </p>
            </div>
     );
}

export default HowToPlayCards;