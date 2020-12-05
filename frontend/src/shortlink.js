export default class {
  constructor(link, jsonrpc = "https://aka.186526.xyz/api/jsonrpc") {
    this.jsonrpc = jsonrpc;
    this.link = link;
  }
  async create(name) {
    const domain = new URL(this.jsonrpc).origin;
    let res = {
      json: {
        jsonrpc: "2.0",
        id: Math.floor(Math.random() * 300),
        method: "create",
        params: { name: name, url: this.link },
      },
    };
    res.text = JSON.stringify(res.json);
    let req = {
      raw: await fetch(this.jsonrpc, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "API From AKA.186526.XYZ",
        },
        body: res.text,
      }),
    };
    req.json = await req.raw.json();
    if (req.json.id !== res.json.id) {
      console.warn("Shortlink Create Warn,ID is not correct");
    }
    if (req.json.result[0] == "/") {
      const answer = domain + req.json.result;
      return answer;
    } else {
      new Error(req.json.result);
    }
  }
  async random() {
    return this.create(
      Math.random().toString(36).substr(2),
      this.url,
      this.jsonrpc
    );
  }
}
