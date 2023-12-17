/**
 * https://docs.github.com/rest/branches/branch-protection?apiVersion=2022-11-28
 */
export interface BranchProtectionPolicy {
    /**
     * [Required]
     * Require status checks to pass before merging. Set to null to disable.
     */
    required_status_checks: RequiredStatusChecks | null,

    /**
     * [Required]
     * Enforce all configured restrictions for administrators.
     * Set to true to enforce required status checks for repository administrators.
     * Set to null to disable.
     */
    enforce_admins: boolean | null,

    /**
     * [Required]
     * Require at least one approving review on a pull request, before merging.
     * Set to null to disable.
     */
    required_pull_request_reviews: RequiredPullRequestReviews | null,

    /**
     * [Required]
     * Restrict who can push to the protected branch.
     * User, app, and team restrictions are only available for organization-owned repositories.
     * Set to null to disable.
     */
    restrictions: Restrictions | null,

    /**
     * Enforces a linear commit Git history, which prevents anyone from pushing merge commits to a branch.
     * Set to true to enforce a linear commit history.
     * Set to false to disable a linear commit Git history.
     * Your repository must allow squash merging or rebase merging before you can enable a linear commit history.
     * Default: false. For more information, see "Requiring a linear commit history" in the GitHub Help documentation.
     */
    required_linear_history?: boolean,

    /**
     * Permits force pushes to the protected branch by anyone with write access to the repository.
     * Set to true to allow force pushes.
     * Set to false or null to block force pushes.
     * Default: false.
     * For more information, see "Enabling force pushes to a protected branch" in the GitHub Help documentation.
     */
    allow_force_pushes?: boolean | null,

    /**
     * Allows deletion of the protected branch by anyone with write access to the repository.
     * Set to false to prevent deletion of the protected branch.
     * Default: false.
     * For more information, see "Enabling force pushes to a protected branch" in the GitHub Help documentation.
     */
    allow_deletions?: boolean,

    /**
     * If set to true, the restrictions branch protection settings which limits who can push will also block pushes which create new branches, unless the push is initiated by a user, team, or app which has the ability to push.
     * Set to true to restrict new branch creation. Default: false.
     */
    block_creations?: boolean,

    /**
     * Requires all conversations on code to be resolved before a pull request can be merged into a branch that matches this rule.
     * Set to false to disable.
     * Default: false.
     */
    required_conversation_resolution?: boolean,

    /**
     * Whether to set the branch as read-only.
     * If this is true, users will not be able to push to the branch.
     * Default: false.
     */
    lock_branch?: boolean,

    /**
     * Whether users can pull changes from upstream when the branch is locked.
     * Set to true to allow fork syncing.
     * Set to false to prevent fork syncing.
     * Default: false.
     */
    allow_fork_syncing?: boolean,
}

export interface Check {
    /**
     * [Required]
     * The name of the required check
     */
    context: string,

    /**
     * The ID of the GitHub App that must provide this check.
     * Omit this field to automatically select the GitHub App that has recently provided this check, or any app if it was not set by a GitHub App.
     * Pass -1 to explicitly allow any app to set the status.
     */
    app_id?: number,
}

export interface RequiredStatusChecks {
    /**
     * [Required]
     * Require branches to be up to date before merging.
     */
    strict: boolean,

    /**
     * [Required]
     * [Deprecated]
     * The list of status checks to require in order to merge into this branch.
     * If any of these checks have recently been set by a particular GitHub App, they will be required to come from that app in future for the branch to merge.
     * Use checks instead of contexts for more fine-grained control.
     */
    contexts: string[],

    /**
     * The list of status checks to require in order to merge into this branch.
     */
    checks?: Check[],
}

export interface DismissalRestrictions {
    /**
     * The list of user logins with dismissal access
     */
    users?: string[],

    /**
     * The list of team slugs with dismissal access
     */
    teams?: string[],

    /**
     * The list of app slugs with dismissal access
     */
    apps?: string[],
}

export interface BypassPullRequestAllowances {
    /**
     * The list of user logins allowed to bypass pull request requirements.
     */
    users?: string[],

    /**
     * The list of team slugs allowed to bypass pull request requirements.
     */
    teams?: string[],

    /**
     * The list of app slugs allowed to bypass pull request requirements.
     */
    apps?: string[],
}

export interface RequiredPullRequestReviews {
    /**
     * Specify which users, teams, and apps can dismiss pull request reviews.
     * Pass an empty dismissal_restrictions object to disable.
     * User and team dismissal_restrictions are only available for organization-owned repositories.
     * Omit this parameter for personal repositories.
     */
    dismissal_restrictions?: DismissalRestrictions,

    /**
     * Set to true if you want to automatically dismiss approving reviews when someone pushes a new commit.
     */
    dismiss_stale_reviews?: boolean,

    /**
     * Blocks merging pull requests until code owners review them.
     */
    require_code_owner_reviews?: boolean,

    /**
     * Specify the number of reviewers required to approve pull requests.
     * Use a number between 1 and 6 or 0 to not require reviewers.
     */
    required_approving_review_count?: number,

    /**
     * Whether the most recent push must be approved by someone other than the person who pushed it.
     * Default: false.Default: false
     */
    require_last_push_approval?: boolean,

    /**
     * Allow specific users, teams, or apps to bypass pull request requirements.
     */
    bypass_pull_request_allowances?: BypassPullRequestAllowances,
}

export interface Restrictions {
    /**
     * [Required]
     * The list of user logins with push access
     */
    users: string[],

    /**
     * [Required]
     * The list of team slugs with push access
     */
    teams: string[],

    /**
     * The list of app slugs with push access
     */
    apps?: string[],
}