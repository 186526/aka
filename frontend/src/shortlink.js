import axios from "axios";
export default class {
  constructor(link, jsonrpc = "https://aka.186526.xyz/api/jsonrpc") {
    this.jsonrpc = jsonrpc;
    this.link = link;
  }
  async create(name) {
    const domain = new URL(this.jsonrpc).host;
    let res = {
      json: {
        jsonrpc: "2.0",
        id: this.randomString(10),
        method: "create",
        params: { name: name, url: this.link },
      },
    };
    res.text = JSON.stringify(res.json);
    let req = {
      raw: await axios.post(this.jsonrpc, res.text, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "API From AKA.186526.XYZ",
        },
      }),
    };
    req.json = await req.raw.data;
    if (req.json.id !== res.json.id) {
      console.warn("Shortlink Create Warn,ID is not correct");
    }
    if (req.json.result[0] == "/") {
      const answer = domain + req.json.result;
      return answer;
    } else {
      return req.json.result;
    }
  }
  async random(len = 8) {
    return this.create(this.randomString(len), this.url, this.jsonrpc);
  }
  randomString(len = 32) {
    let $chars =
      "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678"; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    let maxPos = $chars.length;
    let pwd = "";
    for (let i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  }
}
