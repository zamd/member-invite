
var rp = require('request-promise');

class ApiClient {

    constructor(options){
        this.options = options;
    }

    getTokenAsync(scope) {
        scope = scope || 'create:invite';
        let clientId = this.options.clientId;
        let clientSecret = this.options.clientSecret;
        let domain = this.options.domain;
        let audience = this.options.audience;

        return new Promise((resolve,reject)=>{
            console.log(`getting token...`);
            rp.post({
                uri: `https://${domain}/oauth/token`,
                json: {
                    client_id: clientId,
                    client_secret: clientSecret,
                    grant_type: 'client_credentials',
                    audience: audience,
                    scope: scope
                }
            })
            .then(r=>resolve(r))
            .catch(err=>this.handleError('failed to get token',err,reject));
        });
    }

    handleError(message, err, handler) {
        console.log(err);
        handler(new Error(message));
    }

    createInvite(invite){
        return new Promise( (resolve, reject) => {
            this.getTokenAsync()
            .then(res=>{
                console.log(`creating invite...`);
                rp.post({
                    uri: `${this.options.baseUrl}/api/invite`,
                    headers: {
                        'Authorization': `Bearer ${res.access_token}`
                    },
                    json: invite
                })
                .then(r=>resolve(r))
                .catch(err=>this.handleError('failed to create user', err,reject));
            })
        });
    }
}

module.exports = new ApiClient({
    domain: "telstra-cse.auth0.com",
    clientId:"jZScQT8gCihqBGEqvSUGaTrMEZBFVGxm",
    clientSecret: "C711Wb2uNWmyg7bLa9yohT8lp9fymJ7WlFstKVZJ2yJ0UiPEkevOpP8U-lYpKhPw",
    audience: "https://api.telstra.net",
    baseUrl: "http://localhost:3000"
});