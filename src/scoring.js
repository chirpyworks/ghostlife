/**
 * Pure scoring logic for GHOSTLIFE.
 * Kept separate so the complete 4^8 decision space can be tested without a DOM.
 */
function ghostKeyFromScores(scores,picks){
  let sl=scores.leave+scores.stay;
  let oi=scores.impulse+scores.order;
  let hv=scores.seen+scores.hidden;
  let be=scores.experience+scores.build;
  const p7=picks[6]??0;
  const p8=picks[7]??0;

  if(sl===0)sl=(p7>=2)?1:-1;
  if(oi===0)oi=(p7%2===1)?1:-1;
  if(hv===0)hv=(p8>=2)?1:-1;
  if(be===0)be=(p8%2===1)?1:-1;

  return (sl>0?"L":"S")+
    (oi>0?"I":"O")+
    (hv>0?"V":"H")+
    (be>0?"E":"B");
}
