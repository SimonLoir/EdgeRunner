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
    private __openedFiles = new Map<string, string>();
    private __openedProjects: OpenedProjects = new Set<WorkspaceProject>();
    private __eventEmitter = new EventEmitter();
    private __directory: string | null = null;
    private __currentFile: string | null = null;
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
                    workspaceFolders: await this.getWorkspaceFoldersURI(),

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
                    workspaceFolders: await this.getWorkspaceFoldersURI(),

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
                    workspaceFolders: await this.getWorkspaceFoldersURI(),
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
                    workspaceFolders: await this.getWorkspaceFoldersURI(),
                    rootUri: null,
                    initializationOptions: {},
                },
            });
        } else if (language === 'prolog') {
            await this.trpcClient.lsp.initialize.mutate({
                language: 'prolog',
                workspaceID: this.id,
                options: {
                    processId: null,
                    capabilities: {},
                    clientInfo: {
                        name: 'swipl-lsp-client',
                        version: '0.0.1',
                    },
                    workspaceFolders: await this.getWorkspaceFoldersURI(),
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
        if (this.__openedFiles.has(file)) {
            console.info(`File ${file} is already opened in the workspace`);
            return;
        }
        this.__openedFiles.set(file, content);
        this.__eventEmitter.emit(
            'fileOpened',
            Array.from(this.__openedFiles.keys())
        );
        void this.saveToAsyncStorage(
            WORKSPACE_FILES,
            Array.from(this.__openedFiles.keys())
        );
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
        this.currentFile = file;
    }

    /**
     * Closes a file in the workspace
     * @param file the path of the file to close
     */
    async closeFile(file: string) {
        console.info(`File ${file} was closed in the workspace`);
        this.__openedFiles.delete(file);
        this.__eventEmitter.emit(
            'fileClosed',
            Array.from(this.__openedFiles.keys())
        );
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

        console.info(
            `Closed file ${file} in the workspace`,
            this.__openedFiles.size,
            this.currentFile,
            file
        );

        if (this.currentFile === file && this.__openedFiles.size > 0) {
            this.currentFile = Array.from(this.__openedFiles.keys())[0];
        }
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
        return this.__openedFiles.entries();
    }

    /**
     * Infers the language of a file from its path
     * @param file the path of the file to infer the language from
     */
    public inferLanguageFromFile(file: string): Language | null {
        const extension = file.split('.').pop();
        if (!extension) return null;

        if (['tsx', 'ts', 'jsx', 'js'].includes(extension)) return 'typescript';
        if (extension === 'py') return 'python';
        if (extension === 'c' || extension === 'cpp') return 'c';
        if (extension === 'swift') return 'swift';
        if (extension === 'pl' || extension === 'pro') return 'prolog';

        return null;
    }

    /**
     * Returns the ID of the workspace
     */
    public get id() {
        return this.__id;
    }

    /**
     * Returns the path of the "projects" directory on the server
     */
    public async dir() {
        if (!this.__directory)
            this.__directory =
                await this.trpcClient.projects.getProjectDirectory.query();
        return this.__directory;
    }

    /**
     * Returns the list of symbols for a file
     * @param file the path of the file to get the symbols for
     */
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

    /**
     * Returns the list of workspace folders URIs for the LSP client
     */
    private async getWorkspaceFoldersURI() {
        const directory = await this.dir();
        return this.projects.map((project) => ({
            name: 'workspace',
            uri: 'file://' + path.resolve(directory, project),
        }));
    }

    /**
     * Returns the content of a file
     * @param file the path of the file to get the content for
     */
    public getFileContent(file: string) {
        return this.__openedFiles.get(file);
    }

    /**
     * Saves the content of a file to the server
     * @param file the path of the file to save
     * @param content the content of the file to save
     */
    public async saveFile(file: string, content: string) {
        this.__openedFiles.set(file, content);
        await this.trpcClient.projects.saveFile.mutate({
            path: file,
            content,
        });
    }

    /**
     * Sets the current file
     * @param file the path of the file to set as the current file
     */
    public set currentFile(file: string | null) {
        this.__eventEmitter.emit('currentFileChanged', file);
        void this.saveToAsyncStorage('currentFile', file);
        this.__currentFile = file;
    }

    /**
     * Returns the current file
     */
    public get currentFile() {
        return this.__currentFile;
    }
}
