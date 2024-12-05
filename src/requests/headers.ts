
/**
 * Utility method to build a set of headers required by the SDK outbound API
 *
 * @returns {object} - Object containing key/value pairs of HTTP headers
 */
export const buildJSONHeaders = (): Record<string, any> => {
    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Date: new Date().toUTCString(),
    };
    return headers;
};
