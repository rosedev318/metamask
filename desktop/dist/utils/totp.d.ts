export declare const MAX_TOTP_VALIDATE_RETRY_IN_30_SECONDS = 5;
declare class TOTP {
    private static instance;
    private static validateAttemptsCounter;
    constructor();
    generate: () => string;
    validate: (token: string) => boolean;
    private hasReachedMaxValidateAttempts;
    private resetAttemptsCounter;
    private init;
}
declare const _default: TOTP;
export default _default;
