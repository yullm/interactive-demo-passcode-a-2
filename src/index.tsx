import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { SequenceProvider } from './Context/SequenceContext';
import { ProvenceHook } from './Provence/ProvenceHooks';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <ProvenceHook>
            <SequenceProvider></SequenceProvider>
        </ProvenceHook>
    </React.StrictMode>
);
