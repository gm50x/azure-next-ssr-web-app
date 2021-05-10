import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const tenantName = process.env.AZURE_TENANT_NAME
const userFlow = process.env.AZURE_USER_FLOW

export default NextAuth({
    callbacks: {
        jwt: (token, user, account, profile, isNewUser) => {
            if (account?.idToken) {
                token.accessToken = account.idToken
            }
            return token
        },
        session: (session, token) => {
            if (token.accessToken) {
                session.accessToken = token.accessToken
            }

            return session
        }
    },
    secret: process.env.JWT_SECRET,
    providers: [
        Providers.AzureADB2C({
            tenantId: process.env.AZURE_TENANT_ID,
            clientId: process.env.AZURE_CLIENT_ID,
            clientSecret: process.env.AZURE_CLIENT_SECRET,
            scope: 'offline_access openid profile email',
            version: '2.0',
            params: {
                grant_type: 'authorization_code'
            },
            idToken: true,
            protection: ['none'],
            accessTokenUrl: `https://${tenantName}.b2clogin.com/${tenantName}.onmicrosoft.com/${userFlow}/oauth2/v2.0/token`,
            authorizationUrl: `https://${tenantName}.b2clogin.com/${tenantName}.onmicrosoft.com/${userFlow}/oauth2/v2.0/authorize?response_type=code+id_token&response_mode=form_post`,
            profileUrl: 'https://graph.microsoft.com/oidc/userinfo',
            profile: (profile) => ({
                id: profile.oid,
                name: profile.given_name,
                email: profile.emails?.length && profile.emails[0]
            })
        })
    ]
})