const CONSTANTS = {
    PORT: process.env.PORT || process.env.API_PORT || 3000,
    SERVER_URL: 'https://test.dev.api.octick.site',
};

function baseURL(req) {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.get('host');
    if (!host) {
        throw new Error("Host header is not present in the request");
    }
    const url = `${protocol}://${host}/`;
    return url;
}

module.exports = { CONSTANTS, baseURL };
