declare module 'dmn-js/lib/NavigatedViewer' {
  export default class DmnNavigatedViewer {
    constructor(options: {container: HTMLElement});
    importXML(xml: string): Promise<void>;
    destroy(): void;
    getActiveViewer?(): {
      get?: (name: string) => any;
    } | null;
  }
}
