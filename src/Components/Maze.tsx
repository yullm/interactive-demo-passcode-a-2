import { CSSProperties, useEffect, useRef, useState } from "react";
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

export const MazeB = () => {

    const Provence = useProvence();
    const Sequence = useSequence();

    const [completeCount, setCompleteCount] = useState(0);

    useEffect(()=>{
        completeCount === 5 && Provence.triggerTouchPad?.('passcode-a-maze-b',{complete:true})
    },[completeCount]);

    const onSliderComplete = () => {
        setCompleteCount(completeCount + 1);
    };

    useEffect(()=>{
        Sequence.stage === 0 && setCompleteCount(0);
    },[Sequence.stage]);

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
                flexDirection:'column',
                padding:'1vh',
                gap:'1vh',
                boxSizing:'border-box',
            }}>
                <MazeSlider onComplete={onSliderComplete}></MazeSlider>
                <MazeSlider onComplete={onSliderComplete}></MazeSlider>
                <MazeSlider onComplete={onSliderComplete}></MazeSlider>
                <MazeSlider onComplete={onSliderComplete}></MazeSlider>                
                <MazeSlider onComplete={onSliderComplete}></MazeSlider>
            </div>
        </div>
    );

};

const MazeSlider = (props:{onComplete:()=>void}) => {

    const Sequence = useSequence();

    const containerRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);

    const [canSlide, setCanSlide] = useState(false);
    const [sliding, setSliding] = useState(false);
    const [completion, setCompletion] = useState(0);

    const [complete, setComplete] = useState(false);

    const incompleteRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(()=>{
        clearTimeout(incompleteRef.current);
        if(!sliding && completion < 95){
            incompleteRef.current = setTimeout(()=>{
                setCompletion(0);
            },250)
        }
        completion !== 100 && completion >= 95 && setCompletion(100);
        completion >= 95 ? setComplete(true) : setComplete(false);
    },[sliding,completion]);

    useEffect(()=>{
        complete && props.onComplete();
    },[complete]);

    useEffect(()=>{
        if(Sequence.stage === 0){
            setCompletion(0);
            setComplete(false);
        }
    },[Sequence.stage]);

    return(
        <div style={{
            display:'flex',
            flex:1,
            width:'100%',
            position:'relative',
        }}>
            <div 
                ref={containerRef} 
                style={{
                    display:'flex',
                    flex:1,
                    backgroundColor:SequenceStyles.levelZero,
                    borderRadius:'20vh',
                    padding:'2vh',
                    boxSizing:'border-box',
                }}
                onMouseDown={()=>{
                    !complete && canSlide && setSliding(true);
                }}
                onTouchStart={()=>{
                    !complete && setSliding(true);
                }}
                onMouseUp={()=>setSliding(false)}
                onMouseLeave={()=>setSliding(false)}
                onTouchEnd={()=>setSliding(false)}
                onTouchCancel={()=>setSliding(false)}
                onMouseMove={(evt)=>{
                    if(sliding){
                        const rect = containerRef.current?.getBoundingClientRect();
                        rect && setCompletion(((evt.pageX) / rect.width) * 100);
                    }
                }}
                onTouchMove={(evt)=>{
                    if(sliding){
                        const rect = containerRef.current?.getBoundingClientRect();
                        rect && setCompletion(((evt.touches[0].pageX) / rect.width) * 100);
                    }
                }}
            >
                <div 
                    ref={sliderRef} 
                    style={{
                        display:'flex',
                        height:'100%',
                        width:`${completion}%`,
                        minWidth:'15vh',
                        backgroundColor: completion < 95 ? (sliding ? SequenceStyles.levelFour : canSlide ? SequenceStyles.levelThree : SequenceStyles.levelOne) : SequenceStyles.levelFive,
                        borderRadius:'20vh',
                        transition: (sliding && completion < 95) ? undefined : 'width 1s ease',
                    }}
                    onMouseEnter={()=>setCanSlide(true)}
                    onMouseLeave={()=>setCanSlide(false)}
                ></div>
            </div>
        </div>
    );

};