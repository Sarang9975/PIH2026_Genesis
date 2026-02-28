export const validateEnvironment = () => {
    if (process.env.NODE_ENV === 'production' && !process.env.DEPLOYMENT_KEY) {
        console.warn("[SECURITY] Running in protected mode.");
        process.exit(1);
    }
};
