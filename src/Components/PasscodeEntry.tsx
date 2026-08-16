import { useEffect, useRef, useState } from "react";
import { SequenceStyles, useSequence } from "../Context/SequenceContext";

export const PasscodeEntry = () => {

    const Sequence = useSequence();

    return(
        <div style={{
            ...SequenceStyles.borderContainer,
            ...SequenceStyles.center,
            position:'absolute',
            bottom:'10vh',
            padding:'1vw',
            borderWidth:'1vw',
            gap:'1vw',
        }}>
            <InputButton value="1"></InputButton>
            <InputButton value="2"></InputButton>
            <InputButton value="3"></InputButton>
            <InputButton value="4"></InputButton>
            <InputButton value="5"></InputButton>
            <InputButton value="6"></InputButton>
            <InputButton value="7"></InputButton>
            <InputButton value="8"></InputButton>
            <InputButton value="9"></InputButton>
            <InputButton value="0"></InputButton>
        </div>
    );

};

const InputButton = (props:{value:string}) => {

    const Sequence = useSequence();

    const [touched, setTouched] = useState(false);
    const fadeTimeout = useRef<ReturnType<typeof setInterval>>(undefined);

    useEffect(()=>{
        clearTimeout(fadeTimeout.current);
        touched && (fadeTimeout.current = setTimeout(()=>setTouched(false),250));
    },[touched]);

    return(
        <div 
            style={{
            ...SequenceStyles.borderContainer,
            ...SequenceStyles.center,
                width:'5vw',
                height:'5vw',
                fontSize:'3vw',
                borderColor:touched ? SequenceStyles.levelThree : SequenceStyles.levelOne,
                color:touched ? SequenceStyles.levelThree : SequenceStyles.levelOne,
                fontWeight:800,
                textAlign:'center',
                transition:'color 250ms ease, border-color 250ms ease',
            }}
            onClick={()=>{
                setTouched(true);
                Sequence.onPasscodeInput!(props.value);
            }}
        >{props.value}</div>
    );

};