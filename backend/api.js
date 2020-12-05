export default shortlink = {
    create: async (a, b, jsonrpc = "https://aka.186526.xyz/api/jsonrpc") => {
        const domain = new URL(jsonrpc).origin;
        let res = {
            json: {
                jsonrpc: "2.0",
                id: Math.floor(Math.random() * 300),
                method: "create",
                params: { "name": a, "url": b },
            }
        };
        res.text = JSON.stringify(res.json);
        let req = {
            raw: await fetch(jsonrpc, {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json", "X-Requested-With": "API From AKA.186526.XYZ" },
                body: res.text
            })
        };
        req.json = await req.raw.json();
        if (req.json.id !== res.json.id) {
            console.warn('Shortlink Create Warn,ID is not correct');
        }
        if (req.json.result[0] == "/") {
            const answer = domain + req.json.result;
            return answer;
        } else {
            new Error(req.json.result);
        }
    },
    random: async (a, jsonrpc = "https://aka.186526.xyz/api/jsonrpc") => {
        return shortlink.create(Math.random().toString(36).substr(2),a,jsonrpc);
    }
};