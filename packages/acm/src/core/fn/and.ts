export default (...args: boolean[]) => !args.some(arg => arg === false);
