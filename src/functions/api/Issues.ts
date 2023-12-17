/**
 * https://docs.github.com/rest/issues/issues?apiVersion=2022-11-28#create-an-issue
 */
export interface CreateIssue {
    /**
     * [Required]
     * The title of the issue.
     */
    title: string | number,

    /**
     * The contents of the issue.
     */
    body?: string,

    /**
     * [Deprecated]
     * Login for the user that this issue should be assigned to.
     * NOTE: Only users with push access can set the assignee for new issues.
     * The assignee is silently dropped otherwise.
     * This field is deprecated.
     */
    assignee?: string | null,

    /**
     * The number of the milestone to associate this issue with.
     * NOTE: Only users with push access can set the milestone for new issues.
     * The milestone is silently dropped otherwise.
     */
    milestone?: string | number | null,

    /**
     * Labels to associate with this issue.
     * NOTE: Only users with push access can set labels for new issues.
     * Labels are silently dropped otherwise.
     */
    labels?: string[],

    /**
     * Logins for Users to assign to this issue.
     * NOTE: Only users with push access can set assignees for new issues.
     * Assignees are silently dropped otherwise.
     */
    assignees?: string[],
}