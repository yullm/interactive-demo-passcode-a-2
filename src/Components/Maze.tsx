import { SequenceStyles, useSequence } from "../Context/SequenceContext";

export const MazeA = () => {

    const Sequence = useSequence();

    return(
        <div style={{
            ...SequenceStyles.center,
            ...SequenceStyles.borderContainer,
            position:'absolute',
            width:'90vw',
            height:'90vh',
            backgroundColor: SequenceStyles.levelThree,
            zIndex:1,
        }}>
            <div style={{
                display:'flex',
                flex:1,
                position:'relative',
            }}>

            </div>
        </div>
    );

};