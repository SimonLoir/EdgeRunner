import { Language } from '@repo/api';
import { TRPCClient } from '../api';
import EventEmitter from 'events';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const WORKSPACE_PROJECTS = 'workspace:projects';
export const WORKSPACE_FILES = 'workspace:files';

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
        if (language === 'typescript')
            void this.trpcClient.lsp.initialize.mutate({
                language: 'typescript',
                options: {
                    processId: null,
                    capabilities: {},
                    clientInfo: {
                        name: 'typescript-lsp-client',
                        version: '0.0.1',
                    },
                    workspaceFolders: this.projects.map((project) => ({
                        name: 'workspace',
                        uri: project,
                    })),
                    rootUri: null,
                    initializationOptions: {
                        tsserver: {
                            logDirectory: '.log',
                            logVerbosity: 'verbose',
                            trace: 'verbose',
                        },
                    },
                },
            });
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
        console.info(`File ${file} was opened in the workspace`);
        this.__openedFiles.add(file);
        this.__eventEmitter.emit('fileOpened', this.files);
        void this.saveToAsyncStorage(WORKSPACE_FILES, this.files);
        const language = this.inferLanguageFromFile(file);
        if (language)
            void this.trpcClient.lsp.textDocument.didOpen.query({
                language,
                options: {
                    textDocument: {
                        text: 'Hello world',
                        version: 1,
                        uri: file,
                        languageId: language,
                    },
                },
            });
    }

    /**
     * Closes a file in the workspace
     * @param file the path of the file to close
     */
    closeFile(file: string) {
        console.info(`File ${file} was closed in the workspace`);
        this.__openedFiles.delete(file);
        this.__eventEmitter.emit('fileClosed', this.files);
        void this.saveToAsyncStorage(WORKSPACE_FILES, this.files);
    }

    /**
     * Adds a project to the workspace
     * @param project the path of the project to add
     * @param options options for adding the project
     */
    addProject(project: string, options = { unique: false }) {
        console.info(`Project ${project} was added to the workspace`);
        if (options.unique) this.__openedProjects.clear();
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

    /**
     * Returns the list of opened files
     */
    public get files() {
        return Array.from(this.__openedFiles);
    }

    /**
     * Infers the language of a file from its path
     * @param file the path of the file to infer the language from
     */
    private inferLanguageFromFile(file: string): Language | null {
        const extension = file.split('.').pop();

        if (extension === 'ts' || extension === 'tsx') return 'typescript';

        return null;
    }
}
