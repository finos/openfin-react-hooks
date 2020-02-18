import WINDOW_STATE from "../types/enums/WindowState";

export abstract class IChildWindow {
  window?: any;
  htmlDocument?: HTMLDocument | null;
  state: WINDOW_STATE; // private
  constructor () {
    this.state = WINDOW_STATE.INITIAL;
  }
  abstract create: (options: any) => Promise<any>;
  close = async () => {
    if (this.window) {
      await this.window.close();
      this.reset();
    }
  }
  setState = (state: WINDOW_STATE) => { this.state = state; console.log("State changed to " + this.state); };
  getState = () => this.state;
  getHtmlDocument = () => this.htmlDocument;
  getWindow = () => this.window;
  abstract setupListeners: () => void;
  abstract removeListeners: () => void;
  reset = () => {
    this.state = WINDOW_STATE.INITIAL;
    this.htmlDocument = null;
    this.window = null;
  };
}

export class ChildWindowV1 extends IChildWindow {
  create = async (options: any) => {
    return new Promise((resolve, reject) => {
      const newWindow = new fin.desktop.Window({ ...options, autoShow: true }, () => {
        this.window = newWindow;
        this.setState(WINDOW_STATE.LAUNCHED);
        resolve(newWindow);
      }, reject);
    });
  };
  setupListeners = () => {
    if (this.window) {
      this.htmlDocument = this.window.getNativeWindow().document;
      this.window.getNativeWindow().onclose = this.reset;
    }
  };
  removeListeners = () => {
    if (this.window) {
      this.window.getNativeWindow().onclose = null;
    }
  };
}

export class ChildWindowV2 extends IChildWindow {
  create = async (options: any) => {
      return fin.Window.create(options)
        .then((newWindow) => {
          this.window = newWindow;
          this.setState(WINDOW_STATE.LAUNCHED);
        })
        .catch(console.error);
  };
  setupListeners = () => {
    if (this.window) {
      this.htmlDocument = this.window.getWebWindow().document;
      this.window.addListener("closed", this.reset);
      this.window.removeListener("closed", this.reset);
    }
  };
  removeListeners = () => {
    if (this.window) {
      this.window.removeListener("closed", this.reset);
    }
  };
}