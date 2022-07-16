export var Environment;
(function (Environment) {
    Environment["Staging"] = "staging";
})(Environment || (Environment = {}));
var HTTPMethod;
(function (HTTPMethod) {
    HTTPMethod["Post"] = "POST";
})(HTTPMethod || (HTTPMethod = {}));
export class ApiClient {
    endpoint;
    constructor(env) {
        this.endpoint = `https://1y2kkd6x3e.execute-api.us-east-1.amazonaws.com/${env}/createGameSession`;
    }
    createGameSession(gameId, isAdvancedMode) {
        return fetch(this.endpoint, {
            'method': HTTPMethod.Post,
            headers: {
                'content-type': 'application/json',
                'connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                gameId: gameId,
                isAdvancedMode: isAdvancedMode,
            }),
        }).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        }).then(response => {
            return response;
        });
    }
}
//# sourceMappingURL=ApiClient.js.map