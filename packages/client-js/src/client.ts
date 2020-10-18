import { IPFSResolver, resolveURI, Web3APIDefinition, Web3APIModuleResolver } from "./lib/resolver-demo";
import { Query, QueryResult } from "./lib/types";



export class Web3APIClient {

    _definitionCache: Map<string, Web3APIDefinition> = new Map<string, Web3APIDefinition>();

    constructor(private _resolvers?: Web3APIModuleResolver[]) {
        if (this._resolvers === undefined) {
            this._resolvers = [IPFSResolver];
        }
    }

    public async query(uri: string, query: Query): Promise<QueryResult> {
    
        // Attempt to resolve the URI into a Web3API
        const apiDefinition = await this.getWeb3APIDefinition(uri);
        if (apiDefinition === undefined) {
            throw Error(`Unable to resolve ${uri} into a Web3API`);
        }

        const queryDoc = query.query;

        if (queryDoc.definitions.length > 1) {
            throw Error("Multiple async queries is not supported at this time.");
        }

        if (queryDoc.definitions.length === 0) {
            throw Error("Empty query.");
        }

        const def = queryDoc.definitions[0];

        if (def.kind === "OperationDefinition" && def.name) {

        }

        throw Error(`Unrecognized query definition kind: "${def.kind}"`);
    }

    /**
     * Gets the definition of a Web3API at a given URI.
     * @param uri The URI of the Web3API to get the definition of.
     */
    private async getWeb3APIDefinition(uri: string): Promise<Web3APIDefinition | undefined> {
        let definition = this._definitionCache.get(uri);

        if (definition === undefined) {
            definition = await resolveURI(uri, this._resolvers);
            this._definitionCache.set(uri, definition);
        }

        return definition;
    }
    
}