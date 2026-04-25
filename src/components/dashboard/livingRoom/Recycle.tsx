import React from "react";
import recycleIcon from "../../../assets/recycle.png";

interface ServiceProps {
    data: { pickUpDate: string, lastStatus: string };
    type: 'trash' | 'recycle';
}

const ServiceCard: React.FC<ServiceProps> = ({ data, type }) => {
    const isTrash = type === 'trash';
    
    // Updated themes to match the elevated Slate/Cyan/Indigo palette
    const cardStyle = isTrash 
        ? "bg-slate-900/60 border-indigo-500/40 shadow-[0_20px_50px_rgba(99,102,241,0.1)]" 
        : "bg-slate-900/60 border-cyan-500/40 shadow-[0_20px_50px_rgba(6,182,212,0.1)]";

    const badgeStyle = isTrash 
        ? "bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]" 
        : "bg-cyan-400 text-slate-900 shadow-[0_0_15px_rgba(34,211,238,0.4)]";

    const iconBg = isTrash
        ? "bg-gradient-to-tr from-indigo-600 to-indigo-400"
        : "bg-gradient-to-tr from-cyan-500 to-cyan-300";

    return (
        <div className={`
            relative flex flex-col justify-between p-6 min-h-[170px] 
            backdrop-blur-xl border-2 rounded-[2.5rem] transition-all duration-500
            ${cardStyle}
        `}>
            {/* TOP ROW: ICON & BADGE */}
            <div className="flex justify-between items-start relative z-10">
                <div className="relative">
                    {/* Outer Glow */}
                    <div className={`absolute inset-0 blur-xl rounded-full opacity-20 ${isTrash ? 'bg-indigo-400' : 'bg-cyan-400'}`} />
                    
                    {/* ICON CONTAINER */}
                    <div className={`
                        relative w-14 h-14 rounded-2xl flex items-center justify-center 
                        border border-white/10 shadow-lg transform -rotate-3
                        ${iconBg}
                    `}>
                        {/* Note: Removed 'invert'. If your icon is black, 'brightness-0 invert' 
                           will make it pure white for better visibility on gradients.
                        */}
                        <img 
                            src={recycleIcon} 
                            className="w-8 h-8 brightness-0 invert drop-shadow-md" 
                            alt="service-icon" 
                        />
                    </div>
                </div>
                
                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${badgeStyle}`}>
                    {isTrash ? "TRASH DAY" : "RECYCLING"}
                </div>
            </div>

            {/* MAIN INFO */}
            <div className="mt-4 relative z-10">
                <div className="font-black text-2xl text-white leading-tight italic uppercase tracking-tighter drop-shadow-sm">
                    {isTrash ? "Trash Service" : "Recycle Service"}
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isTrash ? 'bg-indigo-400' : 'bg-cyan-400'}`} />
                    <div className={`text-[11px] font-bold uppercase tracking-widest ${isTrash ? 'text-indigo-300/90' : 'text-cyan-300/90'}`}>
                        Pickup: {data?.pickUpDate || "No Schedule"}
                    </div>
                </div>
            </div>

            {/* STATUS TAG */}
            <div className="absolute right-6 bottom-6 text-[9px] font-black text-white/20 uppercase italic tracking-tighter">
                {data?.lastStatus || "Status OK"}
            </div>

            {/* BACKGROUND ACCENT GLOW */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 blur-[40px] rounded-full pointer-events-none opacity-10 ${isTrash ? 'bg-indigo-500' : 'bg-cyan-500'}`} />
        </div>
    );
};

export const Trash = ({ data }: any) => <ServiceCard data={data} type="trash" />;
export const Recycle = ({ data }: any) => <ServiceCard data={data} type="recycle" />;

export default ServiceCard;