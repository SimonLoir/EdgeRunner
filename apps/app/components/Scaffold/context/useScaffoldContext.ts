import React from 'react';
import { ScaffoldContext } from './ScaffoldContext';

export default function useScaffoldContext() {
    const context = React.useContext(ScaffoldContext);
    if (!context) {
        throw new Error(
            'useScaffoldContext must be used within a ScaffoldContext.Provider'
        );
    }
    return context;
}
