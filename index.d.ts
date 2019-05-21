export const useMaximized: () => [boolean, (shouldMaximize: boolean) => Promise<void>];
export const useDocked: () => boolean;
