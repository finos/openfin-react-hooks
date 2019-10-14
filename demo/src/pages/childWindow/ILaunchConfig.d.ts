interface ILaunchConfig {
  cssUrl?: string;
  htmlUrl?: string;
  shouldClosePreviousOnLaunch: boolean;
  shouldInheritCss: boolean;
  shouldLoadJsxAfterLaunch: boolean;
  shouldInheritScripts: boolean;
  windowName: string;
}

export default ILaunchConfig;
