interface ILaunchConfig {
  cssUrl?: string;
  htmlUrl?: string;
  notificationOptions: fin.NotificationOptions;
  shouldInheritCss?: boolean;
  shouldInheritScripts?: boolean;
  shouldLoadJsxAfterLaunch?: boolean;
}

export default ILaunchConfig;
