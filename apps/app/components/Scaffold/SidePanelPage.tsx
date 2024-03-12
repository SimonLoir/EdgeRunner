import React from 'react';
import { PanelPage } from './context/ScaffoldContext';

type SidePanelPageProps = {
    children: React.ReactNode;
    name: PanelPage;
};

export default function SidePanelPage({ children }: SidePanelPageProps) {
    return <>{children}</>;
}
