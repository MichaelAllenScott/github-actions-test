import fetch from 'node-fetch';

const ZenhubApi = {
    async makeRequest(body) {
        const response = await fetch(
          'https://api.zenhub.com//public/graphql',
          {
            method: 'post',
            body: body,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Node',
                'Authorization': 'Bearer zh_75f22679c48cc395af6cc7620f50b9591f17a43032bb4d9b071b2083c4dfa92f'
            },
          }
        );
        const json = await response.json();
        return json.data;
    },
}

export default ZenhubApi;