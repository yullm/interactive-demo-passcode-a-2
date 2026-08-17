import { createContext, CSSProperties, useContext, useEffect, useRef, useState } from "react";
import { Container } from "../Components/Container";
import { useProvence } from "../Provence/ProvenceHooks";

const SequenceContext = createContext<{
    stage:number,
    passcodeAnswer:string[],
    passcodeInput:string[],
    onPasscodeInput?:(value:string)=>void,
}>({
    stage:0,
    passcodeAnswer:['4','5','1','2'],
    passcodeInput:[],
});

export const useSequence = () => useContext(SequenceContext);

export const SequenceProvider = () => {

    const Provence = useProvence();

    const [stage, setStage] = useState(0);
    const [passcodeAnswer, setPasscodeAnswer] = useState<string[]>(['4','5','1','2']);
    const [passcodeInput, setPasscodeInput] = useState<string[]>([]);

    const onPasscodeInput = (value:string) => {
        if(stage !== 0) return;
        let newInput = [...passcodeInput];
        if(passcodeInput.length < 4){
            newInput.push(value);
        }else{
            newInput = [value];
        }
        //setPasscodeInput(newInput);
        Provence.triggerTouchPad?.('passcode-a-passcode-input',{input:newInput});
    };

    const handleRemoteInput = (buttonID:string, args:{input:string[]}) => {
        setPasscodeInput(args.input);
    };

    const handleSetStage = (buttonID:string, args:{stage:number}) => {
        setStage(args.stage);
    };

    const handleReset = () => {
        setPasscodeInput([]);
        setStage(0);
    };

    useEffect(()=>{
        Provence.registerTouchPadListener?.('passcode-a-passcode-input', handleRemoteInput);
        Provence.registerTouchPadListener?.('passcode-a-passcode-set-stage', handleSetStage);
        Provence.registerTouchPadListener?.('reset', handleReset);
        return(()=>{
            Provence.unregisterTouchPadListener?.('passcode-a-passcode-input', handleRemoteInput);            
            Provence.unregisterTouchPadListener?.('passcode-a-passcode-set-stage', handleSetStage);
            Provence.unregisterTouchPadListener?.('reset', handleReset);
        });
    },[]);

    return(
        <SequenceContext.Provider value={{
            stage:stage,
            passcodeInput:passcodeInput,
            passcodeAnswer:passcodeAnswer,
            onPasscodeInput:onPasscodeInput,
        }}>
            <Container></Container>
        </SequenceContext.Provider>
    );

};

export const SequenceStyles = {
    levelZero: "#46334F",
    levelOne: '#8082a6',
    levelTwo: '#f24f13',
    levelThree: '#f2921D',
    levelFour:'#F2C230',    
    levelFive:'#eacc72',
    center:{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
    } as CSSProperties,
    borderContainer:{
        borderRadius:'1vw',
        borderStyle:'solid',
        borderWidth:'1vw',
        borderColor:'#f24f13',
    } as CSSProperties,
};