import WINDOW_STATE from "../types/enums/WindowState";

export abstract class IChildWindow {
  window?: any;
  htmlDocument?: HTMLDocument | null;
  state: WINDOW_STATE;
  constructor (oldChildWindow?: IChildWindow) {
    if (oldChildWindow) {
      this.state = oldChildWindow.state;
      this.window = oldChildWindow.window;
      this.htmlDocument = oldChildWindow.htmlDocument;
    } else {
      this.state = WINDOW_STATE.INITIAL;
    }
  }

  abstract create: (options: any, setChildWindow: (updatedWindow: IChildWindow) => void) => Promise<any>;
  close = async (setChildWindow: (updatedWindow: IChildWindow) => void) => {
    if (this.window) {
      await this.window.close();
      this.reset(setChildWindow);
    }
  }
  setState = (state: WINDOW_STATE, setChildWindow: (updatedWindow: IChildWindow) => void) => { this.state = state; setChildWindow(this); };
  getState = () => this.state;
  getHtmlDocument = () => this.htmlDocument;
  getWindow = () => this.window;
  abstract setupListeners: (setChildWindow: (updatedWindow: IChildWindow) => void) => void;
  abstract removeListeners: () => void;
  reset = (setChildWindow: (updatedWindow: IChildWindow) => void) => {
    this.state = WINDOW_STATE.INITIAL;
    this.htmlDocument = null;
    this.window = null;
    setChildWindow(this);
  };
}

export class ChildWindowV1 extends IChildWindow {
  create = async (options: any, setChildWindow: (updatedWindow: IChildWindow) => void) => {
    return new Promise((resolve, reject) => {
      const newWindow = new fin.desktop.Window({ ...options, autoShow: true }, () => {
        this.window = newWindow;
        this.state = WINDOW_STATE.LAUNCHED;
        setChildWindow(new ChildWindowV1(this));
        resolve(newWindow);
      }, reject);
    });
  };
  setupListeners = (setChildWindow: (updatedWindow: IChildWindow) => void) => {
    if (this.window) {
      this.htmlDocument = this.window.getNativeWindow().document;
      this.window.getNativeWindow().onclose = this.reset;
      setChildWindow(new ChildWindowV1(this));
    }
  };
  removeListeners = () => {
    if (this.window) {
      this.window.getNativeWindow().onclose = null;
    }
  };
}

export class ChildWindowV2 extends IChildWindow {
  create = async (options: any, setChildWindow: (updatedWindow: IChildWindow) => void) => {
      return fin.Window.create(options)
        .then((newWindow) => {
          this.window = newWindow;
          this.state = WINDOW_STATE.LAUNCHED;
          setChildWindow(new ChildWindowV2(this));
        })
        .catch(console.error);
  };
  setupListeners = (setChildWindow: (updatedWindow: IChildWindow) => void) => {
    if (this.window) {
      this.htmlDocument = this.window.getWebWindow().document;
      this.window.addListener("closed", this.reset);
      this.window.removeListener("closed", this.reset);
      setChildWindow(new ChildWindowV2(this));
    }
  };
  removeListeners = () => {
    if (this.window) {
      this.window.removeListener("closed", this.reset);
    }
  };
}