import { useEffect, useState } from "react";
import { SequenceStyles, useSequence } from "../Context/SequenceContext";

export const PasscodeDisplay = () => {

    const Sequence = useSequence();

    const [inputMap, setInputMap] = useState<string[]>(['','','','']);

    useEffect(()=>{
        const newMap:string[] = [];
        for(let i = 0; i <= 3; i++){
            if(Sequence.passcodeInput.length > i){
                newMap.push(Sequence.passcodeInput[i]);
            }else{
                newMap.push('');
            }
        }
        setInputMap(newMap);
    },[Sequence.passcodeInput]);
    
    return(
        <div style={{
            ...SequenceStyles.borderContainer,
            ...SequenceStyles.center,
            padding:'2vw',
            borderWidth:'1vw',
            gap:'2vw',
        }}>
            {inputMap.map(value => (
                <div style={{
                    ...SequenceStyles.borderContainer,
                    ...SequenceStyles.center,
                    width:'15vw',
                    height:'15vw',
                    fontSize:'8vw',
                    borderColor: value === '' ? SequenceStyles.levelOne : SequenceStyles.levelThree,
                    color:SequenceStyles.levelThree,
                    fontWeight:800,
                    textAlign:'center',
                    transform: value === '' ? 'translateY(0.5vw)' : 'translateY(0)',                    
                    transition:'all 250ms ease',
                }}>{value}</div>
            ))}
        </div>
    );

};