
/**
 * Used to get full hour i.e 1hr 24m
 * @param minutes 
 * @returns `${hour}h ${minuteRemiander}m`
 */
export const timeFormat = (minutes: number)=>{
    const hour = Math.floor(minutes / 60);
    const minuteRemiander = minutes % 60;

    return `${hour}h ${minuteRemiander}m`
}

export const hourFormat = (time: string)=>{
    const date = new Date(time);
    const localTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute:"2-digit",
        hour12: true,
    })
    return localTime;
}

export const fullDateFormat = (time: string)=>{
    return new Date(time).toLocaleString("en-US",{
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "numeric",
        minute: "numeric"
    })
}

export const shortDateFormat = (time: string)=>{
    return new Date(time).toLocaleString("en-US",{
        month: "short",
        day: "2-digit",
        hour: "numeric",
        minute: "numeric"
    })
}

export const kConverter = (num:number): number | string =>{
    if(num >= 1000){
        return (num / 1000).toFixed(2) + "k";
    }else{
        return num;
    }   
}