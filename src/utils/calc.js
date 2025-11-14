export function calcStreak(completionHistory){
    if(!completionHistory || completionHistory.length===0) return 0;
    const days = completionHistory.map(d => {
      const dt = new Date(d); dt.setHours(0,0,0,0);
      return dt.getTime();
    }).sort((a,b)=>b-a);
  
    let streak = 0;
    let expected = (new Date()).setHours(0,0,0,0).getTime();
  
    for(let t of days){
      if(t === expected){ streak++; expected -= 24*60*60*1000; }
      else if(t < expected) break;
    }
    return streak;
  }
  
  export function percentLast30(completionHistory){
    const today = new Date(); today.setHours(0,0,0,0);
    const setDays = new Set((completionHistory||[]).map(d=> new Date(d).setHours(0,0,0,0)));
    let count = 0;
    for(let i=0;i<30;i++){
      const dt = new Date(today - i*24*60*60*1000).getTime();
      if(setDays.has(dt)) count++;
    }
    return Math.round((count/30)*100);
  }
  