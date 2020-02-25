const OAuthConfig = {
    'oauth_uri': 'https://github.com/login/oauth/authorize',
    'client_id': '01a37dc51057d8804903',
    'client_secret': '01b2344bfd2f82168c40a5315d0e9e1e21b106d0',
    'redirect_uri': 'http://localhost:8008/callback'
}

export const OAuth_URL = `${OAuthConfig.oauth_uri}?client_id=${OAuthConfig.client_id}&redirect_uri=${OAuthConfig.redirect_uri}&scope=user`;