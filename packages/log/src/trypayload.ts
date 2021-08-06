export class TryPayload {
    private iError?: object
    private uError?: object
    private iSuccess?: object
    private uSuccess?: object

    /** Add unindexed/indexed data to log when error occurred */
    error(unindexed: object | null | undefined, indexed?: object) {
        if (indexed) {
            this.iError = Object.assign(this.iError || {}, indexed);
        }
        if (unindexed) {
            this.uError = Object.assign(this.uError || {}, unindexed);
        }
        return this;
    }

    /** Add unindexed/indexed data to log when function succeeded */
    success(unindexed: object | null | undefined, indexed?: object) {
        if (indexed) {
            this.iSuccess = Object.assign(this.iSuccess || {}, indexed);
        }
        if (unindexed) {
            this.uSuccess = Object.assign(this.uSuccess || {}, unindexed);
        }
        return this;
    }

    /** Add unindexed/indexed data to log when function finished with any result (error/success) */
    finally(unindexed: object | null | undefined, indexed?: object) {
        if (indexed) {
            this.iSuccess = Object.assign(this.iSuccess || {}, indexed);
            this.iError = Object.assign(this.iError || {}, indexed);
        }
        if (unindexed) {
            this.uError = Object.assign(this.uError || {}, unindexed);
            this.uSuccess = Object.assign(this.uSuccess || {}, unindexed);
        }
        return this;
    }
}
