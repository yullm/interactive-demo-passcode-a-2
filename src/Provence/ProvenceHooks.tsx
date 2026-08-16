import { createContext, useContext, useEffect, useRef } from "react";

type ProvenceHookContextType = {
    registerTouchPadListener?:(buttonID:string,callback:(buttonID:string,args?:any)=>void)=>void,
    unregisterTouchPadListener?:(buttonID:string,callback:(buttonID:string,args?:any)=>void)=>void,
    registerKeyboardListener?:(key:string,callback:(key:string)=>void)=>void,
    unregisterKeyboardListener?:(key:string,callback:(key:string)=>void)=>void,
    triggerTouchPad?:(buttonID:string,args?:any)=>void,
};

const ProvenceHookContext = createContext<ProvenceHookContextType>({});

export const useProvence = () => { return useContext(ProvenceHookContext);};

export const ProvenceHook = (props:any) => {

// #region TouchPad

    const touchPadCallbackDictionaryRef = useRef<{[buttonID:string]:{buttonID:string,callbacks:((buttonID:string,args?:any)=>void)[]}}>({});

    const handleMessageFromParent = (evt:MessageEvent) => {
        evt.data.method && evt.data.method === 'touch-pad-event' && handleTouchPadEvent(evt.data.args);
    };

    const handleTouchPadEvent = (args:{buttonID:string,args?:any}) => {
        touchPadCallbackDictionaryRef.current[args.buttonID]?.callbacks.map(callback => callback(args.buttonID,args.args))
    };

    const registerTouchPadListener = (buttonID:string,callback:(buttonID:string,args?:any)=>void) => {
        touchPadCallbackDictionaryRef.current[buttonID] === undefined && (touchPadCallbackDictionaryRef.current[buttonID] = {buttonID:buttonID,callbacks:[]});
        touchPadCallbackDictionaryRef.current[buttonID].callbacks.indexOf(callback) === -1 && touchPadCallbackDictionaryRef.current[buttonID].callbacks.push(callback);
    };

    const unregisterTouchPadListener = (buttonID:string,callback:(buttonID:string,args?:any)=>void) => {
        if(touchPadCallbackDictionaryRef.current[buttonID]){
            const index = touchPadCallbackDictionaryRef.current[buttonID].callbacks.indexOf(callback);
            index !== -1 && touchPadCallbackDictionaryRef.current[buttonID].callbacks.splice(index,1);
        }
    };

    const triggerTouchPad = (buttonID:string, args?:any) => {
        window.parent?.postMessage?.({method:'trigger-touch-pad',args:{buttonID:buttonID,args:args}},'*');
    };
    
// #endregion Touch Pad

// #region Keyboard

const keyboardCallbackDictionaryRef = useRef<{[key:string]:{key:string,callbacks:((key:string)=>void)[]}}>({});

    const handleKeyboardEvent = (event:KeyboardEvent) => {
        const key = event.key.toUpperCase();
        key.length === 1 && keyboardCallbackDictionaryRef.current[key]?.callbacks.map(callback => callback(key));
        keyboardCallbackDictionaryRef.current['ANY']?.callbacks.map(callback => callback('ANY'));
        window.parent?.postMessage?.({method:'loop-back-keyboard',args:{key:key}},'*');
    };

    const registerKeyboardListener = (key:string,callback:(key:string)=>void) => {
        let upperKey = key.toUpperCase();
        keyboardCallbackDictionaryRef.current[upperKey] === undefined && (keyboardCallbackDictionaryRef.current[upperKey] = {key:upperKey,callbacks:[]});
        keyboardCallbackDictionaryRef.current[upperKey].callbacks.indexOf(callback) === -1 && keyboardCallbackDictionaryRef.current[upperKey].callbacks.push(callback);
    };

    const unregisterKeyboardListener = (key:string,callback:(key:string)=>void) => {
        if(keyboardCallbackDictionaryRef.current[key]){
            let upperKey = key.toUpperCase();
            const index = keyboardCallbackDictionaryRef.current[upperKey].callbacks.indexOf(callback);
            index !== -1 && keyboardCallbackDictionaryRef.current[upperKey].callbacks.splice(index,1);
        }
    };

// #endregion Keyboard

    useEffect(()=>{
        window.addEventListener('message',handleMessageFromParent);
        window.addEventListener('keydown',handleKeyboardEvent,true);
        return(()=>{
            window.removeEventListener('message',handleMessageFromParent);
            window.removeEventListener('keydown',handleKeyboardEvent);
        });
    },[]);   

    return(
        <ProvenceHookContext.Provider {...props} value={{
            registerTouchPadListener:registerTouchPadListener,
            unregisterTouchPadListener:unregisterTouchPadListener,
            registerKeyboardListener:registerKeyboardListener,
            unregisterKeyboardListener:unregisterKeyboardListener,
            triggerTouchPad:triggerTouchPad,
        }} ></ProvenceHookContext.Provider>
    );

};