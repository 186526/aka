import mdui from "mdui";
import shortlink from "./shortlink.js";
import "./mdui.css";
import "./index.css";
var $ = mdui.$;
window.$ = mdui.$;
if (location.protocol !== "https:") {
  console.log("Try HTTPS Up");
  if (location.host !== "localhost:8080") {
    console.log("Not Develop Server");
    location.protocol = "https:";
  }
}
$(() => {
  $("title").html(location.host);
  $(".mdui-typo-headline").html(location.host);
  $("#easier-short").on("click", async () => {
    mdui.dialog({
      title: "Shorten quickly with aka",
      content:
        `<div class="mdui-typo">
          <h3>Drag the link below to the bookmark bar to install the bookmark.</h3>
          <a href="` +
        "javascript:(async()=>{document.addEventListener('shortlinknow',()=>{const d=document,c=(d.head||d.body),e=d.createElement('script');e.defer = true;e.type ='module';e.innerHTML=`import a from 'https://cdn.jsdelivr.net/gh/186526/jsdelivr@master/static/api.js';(async (a) => { const b = await new a(globalThis.location.href, '" +
        window.location.origin +
        "/api/jsonrpc').random(); alert(b); })(a);`;c.appendChild(e);});document.dispatchEvent(new Event('shortlinknow'));})();" +
        `">Shorten quickly with aka</a>
        </div>`,
      buttons: [
        {
          text: "OK",
        },
      ],
    });
  });
  $("#short").on("click", async () => {
    if ($("#shorturl_name").val() === "") {
      $("#shorturl_name").val(new shortlink().randomString(8));
      mdui.updateTextFields();
    }
    if ($("#need_shorturl").val() === "") {
      return;
    }
    try {
      new URL($("#need_shorturl").val());
    } catch (e) {
      try {
        new URL("http://" + $("#need_shorturl").val());
      } catch (e) {
        return;
      }
      $("#need_shorturl").val("http://" + $("#need_shorturl").val());
    }
    const short = $("#shorturl_name").val();
    const url = $("#need_shorturl").val();
    mdui.updateTextFields();
    console.log({
      url: url,
      shortlink: short,
    });
    let Loading = mdui.dialog({
      title: "Loading...",
      content: '<div class="mdui-spinner mdui-theme-pink"></div>',
      buttons: [],
      closeOnEsc: false,
    });
    mdui.mutation();
    let a = new shortlink(url, `${window.location.origin}/api/jsonrpc`);
    let answer = await a.create(short);
    console.log(answer);
    Loading.close();
    mdui.dialog({
      title: "Short link created",
      content: `<div class="mdui-textfield mdui-textfield-floating-label">
    <i class="mdui-icon material-icons">link</i>
    <label class="mdui-textfield-label">Short link</label>
    <input class="mdui-textfield-input" type="url" value="${answer}" disabled/>
    </div>`,
      buttons: [
        {
          text: "OK",
        },
      ],
    });
    mdui.updateTextFields();
  });
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js", {
        scope: "/",
      })
      .then(function (registration) {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      })
      .catch(function (err) {
        console.warn("ServiceWorker registration failed: ", err);
      });
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) {
        return;
      }
      refreshing = true;
      alert("正在更新Service Worker版本 请稍后……");
      console.log("Service Worker 更新中……");
      window.location.reload();
    });
  }
});
