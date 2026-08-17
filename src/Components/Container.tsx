import { useEffect, useState } from "react";
import { SequenceStyles, useSequence } from "../Context/SequenceContext";
import { PasscodeDisplay } from "./PasscodeDisplay";
import { PasscodeEntry } from "./PasscodeEntry";
import { ProvenceHook, useProvence } from "../Provence/ProvenceHooks";
import { MazeA } from "./Maze";

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
            <MazeA></MazeA>
            <PasscodeDisplay></PasscodeDisplay>
        </div>
    );

};