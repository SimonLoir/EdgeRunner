import { Language } from '@repo/api';
import { TRPCClient } from '../api';
import EventEmitter from 'events';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const WORKSPACE_PROJECTS = 'workspace:projects';

export type WorkspaceFile = string;
export type WorkspaceProject = string;
export type OpenedFiles = Set<WorkspaceFile>;
export type OpenedProjects = Set<WorkspaceProject>;

export default class Workspace {
    private __openedFiles: OpenedFiles = new Set();
    private __openedProjects: OpenedProjects = new Set();
    private __eventEmitter = new EventEmitter();
    /**
     * Creates a new Workspace
     * @param trpcClient The tRPC client used inside the workspace
     */
    constructor(private trpcClient: TRPCClient) {}

    /**
     * Registers a new language in the workspace
     * @param language the name of the language to register
     */
    registerLanguage(language: Language) {
        console.info(`Language ${language} was added to the workspace`);
    }

    /**
     * Restarts the services related to the specified programming language
     * @param language the name of the language for which the services should be restarted
     */
    restartLanguageServices(language: Language) {
        console.info(`Restarting language services for ${language}`);
    }

    /**
     * Event emitter for the workspace
     */
    get events() {
        return this.__eventEmitter;
    }

    /**
     * Opens a file in the workspace
     * @param file the path of the file to open
     */
    openFile(file: string) {
        this.__openedFiles.add(file);
        this.__eventEmitter.emit('fileOpened', Array.from(this.__openedFiles));
    }

    /**
     * Closes a file in the workspace
     * @param file the path of the file to close
     */
    closeFile(file: string) {
        this.__openedFiles.delete(file);
        this.__eventEmitter.emit('fileClosed', Array.from(this.__openedFiles));
    }

    /**
     * Adds a project to the workspace
     * @param project the path of the project to add
     */
    addProject(project: string) {
        console.info(`Project ${project} was added to the workspace`);
        this.__openedProjects.add(project);
        this.__eventEmitter.emit('projectAdded', this.projects);
        void this.saveToAsyncStorage(WORKSPACE_PROJECTS, this.projects);
    }

    /**
     * Removes a project from the workspace
     * @param project the path of the project to remove
     */
    removeProject(project: string) {
        console.info(`Project ${project} was removed from the workspace`);
        this.__openedProjects.delete(project);
        this.__eventEmitter.emit('projectRemoved', this.projects);
        void this.saveToAsyncStorage(WORKSPACE_PROJECTS, this.projects);
    }

    /**
     * Saves data to async storage
     * @param key the key to save the data under
     * @param data the data to save to async storage under the specified key (will be stringified)
     */
    saveToAsyncStorage<T>(key: string, data: T) {
        return AsyncStorage.setItem(key, JSON.stringify(data));
    }

    /**
     * Returns the list of opened projects
     */
    public get projects() {
        return Array.from(this.__openedProjects);
    }
}
