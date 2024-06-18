import { BasePostMessageStream } from '@metamask/post-message-stream';
declare type WebViewExecutorStreamArgs = {
    name: string;
    target: string;
    targetWindow: Window['ReactNativeWebView'];
};
export declare class WebViewExecutorStream extends BasePostMessageStream {
    #private;
    /**
     * A special post-message-stream to be used by the WebView executor.
     *
     * This stream is different in a few ways:
     * - It expects data to be base64 encoded
     * - It stringifies the data it posts
     * - It does less validation of origins
     *
     * @param args - Options bag.
     * @param args.name - The name of the stream. Used to differentiate between
     * multiple streams sharing the same window object. child:WebView
     * @param args.target - The name of the stream to exchange messages with. parent:rnside
     * @param args.targetWindow - The window object of the target stream.
     */
    constructor({ name, target, targetWindow }: WebViewExecutorStreamArgs);
    /**
     * Webview needs to receive strings only on postMessage. That's the main difference between this and the original window post message stream.
     * Reference: https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md?plain=1#L471
     */
    protected _postMessage(data: unknown): void;
    private _onMessage;
    _destroy(): void;
}
export {};
