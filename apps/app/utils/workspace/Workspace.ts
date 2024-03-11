import { Language } from '@repo/api';
import { TRPCClient } from '../api';

export default class Workspace {
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
}
