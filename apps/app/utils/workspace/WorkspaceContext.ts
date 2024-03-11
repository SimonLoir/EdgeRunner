import { createContext } from 'react';
import Workspace from './Workspace';

const WorkspaceContext = createContext<Workspace | null>(null);
export default WorkspaceContext;
