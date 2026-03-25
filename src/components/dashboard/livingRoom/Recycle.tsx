import React from "react";
import recycleIcon from "../../../assets/recycle.png";

interface ServiceProps {
    data: { pickUpDate: string, lastStatus: string };
    type: 'trash' | 'recycle';
}

const ServiceCard: React.FC<ServiceProps> = ({ data, type }) => {
    const isTrash = type === 'trash';
    // Darker base backgrounds for contrast against light wallpaper
    const themeColor = isTrash ? "border-indigo-500/40 bg-black/40" : "border-cyan-500/40 bg-black/40";
    const badgeColor = isTrash ? "bg-indigo-600/80 text-white" : "bg-cyan-600/80 text-black";

    return (
        <div className={`
            relative flex flex-col justify-between p-5 min-h-[160px] 
            backdrop-blur-md border-2 rounded-[2rem] shadow-2xl
            ${themeColor}
        `}>
            <div className="flex justify-between items-start">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <img src={recycleIcon} className="w-8 h-8 invert opacity-90" alt="service-icon" />
                </div>
                
                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg ${badgeColor}`}>
                    {isTrash ? "TRASH DAY" : "RECYCLING"}
                </div>
            </div>

            <div className="mt-4">
                <div className="font-black text-2xl text-white leading-tight italic uppercase tracking-tighter drop-shadow-md">
                    {isTrash ? "Trash Service" : "Recycle Service"}
                </div>
                <div className={`text-xs font-black uppercase tracking-[0.2em] mt-1 ${isTrash ? 'text-indigo-300' : 'text-cyan-300'}`}>
                    Pickup: {data?.pickUpDate || "No Schedule"}
                </div>
            </div>

            <div className="absolute right-5 bottom-5 text-[10px] font-black text-white/20 uppercase italic tracking-widest">
                {data?.lastStatus || "Status OK"}
            </div>
        </div>
    );
};

// Exporting refined versions
export const Trash = ({ data }: any) => <ServiceCard data={data} type="trash" />;
export const Recycle = ({ data }: any) => <ServiceCard data={data} type="recycle" />;

export default ServiceCard;

//