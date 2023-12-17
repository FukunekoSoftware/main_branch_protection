import { createHmac } from "crypto";
import { DefaultAzureCredential } from "@azure/identity";
import { KeyVaultSecret, SecretClient } from "@azure/keyvault-secrets";
import { Failure, Result, Success } from "../api/Result";
import { Error, ErrorType } from "../api/Error";

interface SecretInformation {
    env: string,
    secretName: string,
}

interface Config {
    token: SecretInformation,
    signatureSecret: SecretInformation,
}

const VAULT_URL = "https://fumikeyvaultgithub.vault.azure.net/";

const CONFIG: Config = {
    "token": {
        env: process.env.PAT_TOKEN,
        secretName: "PatToken",
    },
    "signatureSecret": {
        env: process.env.SIGNATURE_SECRET,
        secretName: "SignatureSecret",
    }
};

const getSecret = async (secretInformation: SecretInformation): Promise<Result<string, Error>> => {
    const environment = process.env.AZURE_FUNCTIONS_ENVIRONMENT;
    if (environment === "Development") {
        const token = secretInformation.env;
        if (!token) {
            throw new Failure({
                type: ErrorType.Unknown,
                message: "Unable to load value from local env.",
            });
        }
        return new Success(token);
    } else {
        const credential = new DefaultAzureCredential();
        const client = new SecretClient(VAULT_URL, credential);
        const secret: KeyVaultSecret = await client.getSecret(secretInformation.secretName);
        if (secret && secret.value) {
            return new Success(secret.value);
        }
        throw new Failure({
            type: ErrorType.Unknown,
            message: "Unable to load value from Key Vault.",
        });
    }
};

const getPatToken = async (): Promise<Result<string, Error>> => {
    return getSecret(CONFIG.token);
};

const getSignatureSecret = async (): Promise<Result<string, Error>> => {
    return getSecret(CONFIG.signatureSecret);
};

const calculateSignature = (signatureSecret: string, body: string): string => `sha256=${createHmac('sha256', signatureSecret).update(body, 'utf8').digest('hex')}`;

export { getPatToken, getSignatureSecret, calculateSignature };