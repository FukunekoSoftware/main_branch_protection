import { Response } from "node-fetch";
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { RepositoriesEvent, Repository, User } from "./model/GitHub";
import { calculateSignature, getPatToken, getSignatureSecret } from "./auth/Secret";
import { Result } from "./api/Result";
import { Error, ErrorType } from "./api/Error";
import { GitHubAPI } from "./api/GitHubAPI";

export async function httpTrigger1(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const body: string = await request.text();

        const signature = request.headers.get('x-hub-signature-256');
        console.log(`signature: ${signature}`);
        const getSignatureSecretResult: Result<string, Error> = await getSignatureSecret();
        if (getSignatureSecretResult.isFailure()) {
            console.error(`getPatToken() failed. Error type: ${getSignatureSecretResult.error.type}, message: ${getSignatureSecretResult.error.message}`)
            switch (getSignatureSecretResult.error.type) {
                case ErrorType.Forbidden: {
                    return { status: 403, body: getSignatureSecretResult.error.message };
                }
                case ErrorType.NotFound: {
                    return { status: 404, body: getSignatureSecretResult.error.message };
                }
                default: {
                    return { status: 500, body: getSignatureSecretResult.error.message };
                }
            }
        }
        const signatureSecret = getSignatureSecretResult.value;
        const calculatedSignature = calculateSignature(signatureSecret, body);
        context.log(`calculatedSignature: ${calculatedSignature}`);
        if (calculatedSignature !== signature) {
            const errorMessage = `"x-hub-signature-256" header signature and caluculated signature didn't match.`;
            console.error(errorMessage);
            return { status: 400, body: errorMessage };
        }

        const repositoriesEvent: RepositoriesEvent = JSON.parse(body);
        console.log(repositoriesEvent);

        if (repositoriesEvent.action !== "created") {
            console.log(`Skip subsequent processing because the action is not "created"`);
            return { status: 304 };
        }

        const repository: Repository = repositoriesEvent.repository;
        const defaultBranch = repository.default_branch;
        console.log(`defaultBranch: ${defaultBranch}`);

        const owner: User = repository.owner;

        const getTokenResult: Result<string, Error> = await getPatToken();
        if (getTokenResult.isFailure()) {
            console.error(`getPatToken() failed. Error type: ${getTokenResult.error.type}, message: ${getTokenResult.error.message}`)
            switch (getTokenResult.error.type) {
                case ErrorType.Forbidden: {
                    return { status: 403, body: getTokenResult.error.message };
                }
                case ErrorType.NotFound: {
                    return { status: 404, body: getTokenResult.error.message };
                }
                default: {
                    return { status: 500, body: getTokenResult.error.message };
                }
            }
        }
        const token: string = getTokenResult.value;
        const api: GitHubAPI = new GitHubAPI(token);

        const protectBranchResult: Response = await api.protectBranch(owner.login, repository.name, defaultBranch);
        console.log(protectBranchResult);
        if (!protectBranchResult.ok) {
            return { status: 500 };
        }
        const protectBranchResultJson = await protectBranchResult.json();
        console.log(protectBranchResultJson);

        const createIssueResult: Response = await api.createIssue(owner.login, repository.name);
        console.log(createIssueResult);
        if (!createIssueResult.ok) {
            return { status: 500 };
        }
        const createIssueResultJson = await createIssueResult.json();
        console.log(createIssueResultJson);

        return { status: 200 };
    } catch (error) {
        console.error(error);
        return { status: 500, body: `Unable to process the request. Error: ${error.message}` };
    }
};

app.http('httpTrigger1', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: httpTrigger1
});
