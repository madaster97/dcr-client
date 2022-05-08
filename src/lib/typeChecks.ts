export const checkIsString = (s: string | number): s is string => {
    return typeof s === 'string';
}
export const getNotStringError = (name: string, val: number): string => `token response item '${name}' was not a string: ${val}`;