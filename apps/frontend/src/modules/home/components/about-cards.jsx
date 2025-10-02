export function AboutCards({title, description}) {
    return ( 
        <div className="bg-white rounded-[10px] border-[2px] border-[#f62d4a] flex-[1] size text-black flex justify-between items-start flex-col p-[15px]">
            <p className="text-[12px] font-[700]">{title}</p>
            <p className="text-[12px]">{description}</p>
        </div>
     );
}
