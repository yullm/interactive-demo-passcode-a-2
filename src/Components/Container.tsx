import { useEffect, useState } from "react";
import { SequenceStyles, useSequence } from "../Context/SequenceContext";
import { PasscodeDisplay } from "./PasscodeDisplay";
import { ProvenceHook, useProvence } from "../Provence/ProvenceHooks";
import { MazeA, MazeB } from "./Maze";

export const Container = () => {

    const Provence = useProvence();
    const Sequence = useSequence();

    return(
        <div style={{
            display:'flex',
            flexDirection:'column',
            width:'100vw',
            maxWidth:'100vw',
            height:'100vh',
            maxHeight:'100vh',
            justifyContent:'center',
            alignItems:'center',
            overflow:'hidden',
            backgroundColor:SequenceStyles.levelZero,
            userSelect:'none',
        }}>
            <MazeB></MazeB>
            <PasscodeDisplay></PasscodeDisplay>
        </div>
    );

};