import { Language } from '@repo/api';
import { TRPCClient } from '../api';
import EventEmitter from 'events';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 } from 'uuid';
//@ts-ignore - no types for react-native-path
import path from 'react-native-path';

export const WORKSPACE_PROJECTS = 'workspace:projects';
export const WORKSPACE_FILES = 'workspace:files';

export type WorkspaceFile = string;
export type WorkspaceProject = string;
export type OpenedFiles = WorkspaceFile[];
export type OpenedProjects = Set<WorkspaceProject>;

export default class Workspace {
    private __id = v4();
    private __openedFiles: OpenedFiles = [];
    private __openedProjects: OpenedProjects = new Set();
    private __eventEmitter = new EventEmitter();
    private __directory: string | null = null;
    /**
     * Creates a new Workspace
     * @param trpcClient The tRPC client used inside the workspace
     */
    constructor(private trpcClient: TRPCClient) {}

    /**
     * Registers a new language in the workspace
     * @param language the name of the language to register
     */
    async registerLanguage(language: Language) {
        console.info(`Language ${language} was added to the workspace`);
        const directory = await this.dir();
        if (language === 'typescript') {
            await this.trpcClient.lsp.initialize.mutate({
                language: 'typescript',
                workspaceID: this.id,
                options: {
                    processId: null,
                    capabilities: {},
                    clientInfo: {
                        name: 'typescript-lsp-client',
                        version: '0.0.1',
                    },
                    workspaceFolders: this.projects.map((project) => ({
                        name: 'workspace',
                        uri: 'file://' + path.resolve(directory, project),
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
        } else if (language === 'python') {
            await this.trpcClient.lsp.initialize.mutate({
                language: 'python',
                workspaceID: this.id,
                options: {
                    processId: null,
                    capabilities: {},
                    clientInfo: {
                        name: 'python-lsp-client',
                        version: '0.0.1',
                    },
                    workspaceFolders: this.projects.map((project) => ({
                        name: 'workspace',
                        uri: 'file://' + path.resolve(directory, project),
                    })),
                    rootUri: null,
                    initializationOptions: {},
                },
            });
        } else if (language === 'c') {
            await this.trpcClient.lsp.initialize.mutate({
                language: 'c',
                workspaceID: this.id,
                options: {
                    processId: null,
                    capabilities: {},
                    clientInfo: {
                        name: 'c-lsp-client',
                        version: '0.0.1',
                    },
                    workspaceFolders: this.projects.map((project) => ({
                        name: 'workspace',
                        uri: 'file://' + path.resolve(directory, project),
                    })),
                    rootUri: null,
                    initializationOptions: {},
                },
            });
        } else if (language === 'swift') {
            await this.trpcClient.lsp.initialize.mutate({
                language: 'swift',
                workspaceID: this.id,
                options: {
                    processId: null,
                    capabilities: {},
                    clientInfo: {
                        name: 'swift-lsp-client',
                        version: '0.0.1',
                    },
                    workspaceFolders: this.projects.map((project) => ({
                        name: 'workspace',
                        uri: 'file://' + path.resolve(directory, project),
                    })),
                    rootUri: null,
                    initializationOptions: {},
                },
            });
        }
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
     * @param content the content of the file to open
     */
    async openFile(file: string, content: string) {
        this.__openedFiles.push(file);
        this.__eventEmitter.emit('fileOpened', this.files);
        void this.saveToAsyncStorage(WORKSPACE_FILES, this.files);
        const language = this.inferLanguageFromFile(file);
        const directory = await this.dir();
        if (language) {
            await this.trpcClient.lsp.textDocument.didOpen.query({
                language,
                workspaceID: this.id,
                options: {
                    textDocument: {
                        text: content,
                        version: 1,
                        uri: 'file://' + path.resolve(directory, file),
                        languageId: language,
                    },
                },
            });
            console.info(`Opened file ${file} in language ${language}`);
        }
        console.info(`File ${file} was opened in the workspace`);
    }

    /**
     * Closes a file in the workspace
     * @param file the path of the file to close
     */
    async closeFile(file: string) {
        console.info(`File ${file} was closed in the workspace`);
        this.__openedFiles = this.__openedFiles.filter((f) => f !== file);
        this.__eventEmitter.emit('fileClosed', this.files);
        void this.saveToAsyncStorage(WORKSPACE_FILES, this.files);
        const language = this.inferLanguageFromFile(file);
        if (language)
            await this.trpcClient.lsp.textDocument.didClose.query({
                language,
                workspaceID: this.id,
                options: {
                    textDocument: {
                        uri: 'file://' + path.resolve(await this.dir(), file),
                    },
                },
            });
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
    public inferLanguageFromFile(file: string): Language | null {
        const extension = file.split('.').pop();

        if (extension === 'ts' || extension === 'tsx') return 'typescript';
        if (extension === 'py') return 'python';
        if (extension === 'c' || extension === 'cpp') return 'c';
        if (extension === 'swift') return 'swift';

        return null;
    }

    /**
     * Returns the ID of the workspace
     */
    public get id() {
        return this.__id;
    }

    public async dir() {
        if (!this.__directory)
            this.__directory =
                await this.trpcClient.projects.getProjectDirectory.query();
        return this.__directory;
    }

    public async getSymbolsForFile(file: WorkspaceFile) {
        const language = this.inferLanguageFromFile(file);
        if (!language) {
            return [];
        }
        return this.trpcClient.lsp.textDocument.documentSymbol.query({
            language: language,
            workspaceID: this.id,
            options: {
                textDocument: {
                    uri: 'file://' + path.resolve(await this.dir(), file),
                },
            },
        });
    }
}
