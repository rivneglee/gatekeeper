export declare const FN_PREFIX = "fn::";
export declare const functions: {
    [x: string]: ((...args: boolean[]) => boolean) | ((a: any[] | undefined, b: any) => boolean);
};
