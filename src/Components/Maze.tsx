import { CSSProperties, useEffect, useState } from "react";
import { SequenceStyles, useSequence } from "../Context/SequenceContext";
import { useProvence } from "../Provence/ProvenceHooks";

export const MazeA = () => {

    const Sequence = useSequence();
    const Provence = useProvence();

    const[aAligned, setAAligned] = useState(false);
    const[bAligned, setBAligned] = useState(false);

    const onRotatorChange = (id:string, aligned:boolean) => {
        id === 'A' ? setAAligned(aligned) : setBAligned(aligned);
    };

    const [confirmDistance, setConfirmDistance] = useState(5);
    const [delay, setDelay] = useState(true);

    useEffect(()=>{
        let distance = 10;
        aAligned && bAligned && (distance = 75);
        aAligned && !bAligned && (distance = 40);
        distance > confirmDistance ? setDelay(true) : setDelay(false);
        setConfirmDistance(distance);
        Provence.triggerTouchPad?.('passcode-a-maze-a',{complete:(aAligned && bAligned)});
    },[aAligned,bAligned]);

    return(
        <div style={{
            ...SequenceStyles.center,
            ...SequenceStyles.borderContainer,
            position:'absolute',
            top: Sequence.stage === 1 ? '3.5vh' : '-100vh',
            width:'90vw',
            height:'90vh',
            backgroundColor: SequenceStyles.levelThree,
            transition:'top 1s ease',
            zIndex:1,
        }}>
            <div style={{
                display:'flex',
                width:'100%',
                height:'100%',
                position:'relative',
                ...SequenceStyles.center,
            }}>
                <div style={{
                    position:'absolute',
                    width:'80vw',
                    height:'10vh',
                    borderRadius:"10vh",
                    backgroundColor:SequenceStyles.levelZero,
                }}></div>
                <MazeARotator id={'A'} style={{left:'20vw'}} onChange={onRotatorChange}></MazeARotator>
                <MazeARotator id={'B'} style={{right:'20vw'}} onChange={onRotatorChange}></MazeARotator>
                <div style={{
                    position:'absolute',
                    width:`${confirmDistance}vw`,
                    left: '7.5vw',
                    height:'5vh',
                    borderRadius:"10vh",
                    backgroundColor:SequenceStyles.levelFour,
                    zIndex:2,
                    transition:'width 0.2s ease',
                    transitionDelay: delay ? '700ms' : '0ms',
                    pointerEvents:'none',
                }}></div>
            </div>
        </div>
    );

};

const MazeARotator = (props:{id:string,style?:CSSProperties, onChange?:(id:string, aligned:boolean)=>void}) => {

    const Sequence = useSequence();

    const [clicks, setClicks] = useState(0);
    const [rotation, setRotation] = useState(0);

    useEffect(()=>{
        setRotation(90 * clicks);
        props.onChange?.(props.id, clicks % 2 === 1);
    },[clicks]);

    useEffect(()=>{
        Sequence.stage === 0 && setClicks(0);
    },[Sequence.stage])

    return(
        <div 
            style={{
                ...SequenceStyles.center,
                position:'absolute',
                width: '20vw',
                height: '20vw',
                backgroundColor:SequenceStyles.levelOne,
                borderRadius:'50%',
                overflow:'hidden',
                transform:`rotate(${rotation}deg)`,
                transition:'transform 1s ease',
                ...props.style,
            }}
            onClick={()=>{
                setClicks(clicks + 1);
            }}
        >
            <div style={{
                height:'100%',
                width:'10vh',
                backgroundColor: SequenceStyles.levelZero,
            }}></div>
        </div>
    );

};