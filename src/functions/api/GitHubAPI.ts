import fetch from "node-fetch";
import { BranchProtectionPolicy } from "./BranchProtectionPolicy";
import { CreateIssue } from "./Issues";

const URL_BASE = "https://api.github.com";

const createHeaders = (token: string): any => {
    return {
        "Content-Type": "application/json",
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
    }
}

const DEFAULT_BRANCH_PROTECTION_POLICY: BranchProtectionPolicy = {
    required_status_checks: {
        strict: true,
        contexts: ["continuous-integration/travis-ci"],
    },
    enforce_admins: true,
    required_pull_request_reviews: {
        dismiss_stale_reviews: true,
        require_code_owner_reviews: true,
        required_approving_review_count: 2,
    },
    restrictions: null,
    allow_force_pushes: false,
};

const DEFAULT_GITHUB_USER = "shiroyama";

const DEFAULT_CREATE_ISSUE: CreateIssue = {
    title: "Branch protection was automatically configured.",
    assignees: [DEFAULT_GITHUB_USER],
    labels: ["enhancement"],
    body: `@${DEFAULT_GITHUB_USER} Branch protection was automatically configured.

- required_status_checks:
    - strict: ${DEFAULT_BRANCH_PROTECTION_POLICY.required_status_checks.strict}
    - contexts: ${DEFAULT_BRANCH_PROTECTION_POLICY.required_status_checks.contexts}
- enforce_admins: ${DEFAULT_BRANCH_PROTECTION_POLICY.enforce_admins}
- required_pull_request_reviews:
    - dismiss_stale_reviews: ${DEFAULT_BRANCH_PROTECTION_POLICY.required_pull_request_reviews.dismiss_stale_reviews}
    - require_code_owner_reviews: ${DEFAULT_BRANCH_PROTECTION_POLICY.required_pull_request_reviews.require_code_owner_reviews}
    - required_approving_review_count: ${DEFAULT_BRANCH_PROTECTION_POLICY.required_pull_request_reviews.required_approving_review_count}
- restrictions: ${DEFAULT_BRANCH_PROTECTION_POLICY.restrictions ? DEFAULT_BRANCH_PROTECTION_POLICY.restrictions : "None"}
- allow_force_pushes: ${DEFAULT_BRANCH_PROTECTION_POLICY.allow_force_pushes}

See [Update branch protection](https://docs.github.com/en/rest/branches/branch-protection?apiVersion=2022-11-28#update-branch-protection) for details.
`,
};

export class GitHubAPI {
    token: string;

    constructor(token: string) {
        this.token = token;
    }

    async protectBranch(owner: string, repo: string, branch: string): Promise<Response> {
        const url = `${URL_BASE}/repos/${owner}/${repo}/branches/${branch}/protection`;
        const branchProtectionPolicy = DEFAULT_BRANCH_PROTECTION_POLICY;
        return fetch(url, {
            method: "PUT",
            headers: createHeaders(this.token),
            body: JSON.stringify(branchProtectionPolicy)
        })
    };

    async createIssue(owner: string, repo: string): Promise<Response> {
        const url = `${URL_BASE}/repos/${owner}/${repo}/issues`;
        const createIssue = DEFAULT_CREATE_ISSUE;
        return fetch(url, {
            method: "POST",
            headers: createHeaders(this.token),
            body: JSON.stringify(createIssue)
        })
    };
}