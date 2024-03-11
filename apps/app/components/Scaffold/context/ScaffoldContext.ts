import React from 'react';

export type PanelPage = 'file-explorer' | 'symbols-explorer' | null;

export type ScaffoldContextType = {
    sidePanelOpen: boolean;
    setSidePanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
    sidePanelPage: PanelPage;
    setSidePanelPage: React.Dispatch<React.SetStateAction<PanelPage>>;
};
export const ScaffoldContext = React.createContext<ScaffoldContextType | null>(
    null
);
