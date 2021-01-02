try {
    const list = __aka__;
}catch(err){
    return new Response(
        `The KV named "__aka__" was not found!`
    );
}
const aka = {};

const jsonrpcheaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Max-Age': '86400000',
    'Access-Control-Request-Headers': 'Content-Type',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
};

const reqvar = (search, t) => {
    let vars = search.substring(1).split("&");
    for (let i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == t) return pair[1];
    }
    return (false);
};

aka.create = async (i, url) => {
    try {
        new URL(url);
    } catch (err) {
        return {
            status: false,
            error: "Not a URL",
        };
    }
    if (await list.get(i)) { return { status: false, error: "The URL already exists" }; }
    if (i.match(
        RegExp("([0-9A-Za-z_!~*'().;:@=+$,%-])*")
    )["0"] !== i) { return { status: false, error: "Bad Request" }; }
    await list.put(
        key = i,
        value = url,
    );
    return {
        status: true,
        url: `/${i}`,
    };
};

aka.return = async (i) => {
    let a = await ((e) => {
        let a = e.replace("/", "");
        if (a == "") {
            return null;
        } else {
            return list.get(a);
        }
    })(i);
    if (a === null) {
        return new Response("ShortLink Not Found", { status: 404 });
    } else {
        return new Response("ShortLink Found", { status: 302, headers: { Location: a } });
    }
};

aka.api = {};
aka.api.new = async (req) => {
    let url = new URL(req.url);
    console.log(url);
    console.log(req.url);
    let request = {
        name: decodeURIComponent(reqvar(url.search, "name")),
        url: decodeURIComponent(reqvar(url.search, "url")),
    };
    console.log(request);
    let status = await aka.create(request.name, request.url);
    if (status.status) {
        return new Response(JSON.stringify(status), {
            headers: {
                "Content-Type": "application/json",
            }
        });
    } else {
        return new Response(JSON.stringify(status), {
            headers: {
                status: 400,
                "Content-Type": "application/json",
            }
        });
    }
};

aka.api.jsonrpc = async (req) => {
    if (req.method !== "POST") {
        return new Response(JSON.stringify(
            {
                jsonrpc: "2.0",
                error: {
                    code: -32600,
                    message: "Invalid Request"
                },
                id: null
            }
        ), { headers: jsonrpcheaders });
    }
    let reqbody = await req.text();
    console.log(reqbody);
    let reqjson = JSON.parse(reqbody);
    if (reqjson.jsonrpc !== "2.0") {
        return new Response(JSON.stringify(
            {
                jsonrpc: "2.0",
                error: {
                    code: -32700,
                    message: "Parse error"
                },
                id: null
            }
        ), { headers: jsonrpcheaders });
    }
    if (reqjson.method === "create") {
        let status = await aka.create(reqjson.params.name, reqjson.params.url);
        return new Response(((a, b) => {
            return JSON.stringify({
                jsonrpc: "2.0",
                result: ((a) => {
                    if (a.status) {
                        return a.url;
                    } else {
                        return a.error;
                    }
                })(a),
                id: b.id,
            });
        })(status, reqjson), { headers: jsonrpcheaders });
    } else {
        return new Response(JSON.stringify(
            {
                jsonrpc: "2.0",
                error: {
                    code: -32601,
                    message: "Method not found"
                },
                id: null
            }
        ), { headers: jsonrpcheaders });
    }
};

const routes = [{
    route: "/api/new",
    to: aka.api.new,
}];

addEventListener("fetch", e => {
    e.respondWith(handler(e.request));
});

const handler = async (req) => {
    if (new URL(req.url).pathname === "/api/jsonrpc") {
        return aka.api.jsonrpc(req);
    }
    for (let x of routes) {
        if (new URL(req.url).pathname === x.route) {
            console.log(x);
            return x.to(req);
        }
    }
    return aka.return(new URL(req.url).pathname);
};
