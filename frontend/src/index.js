import mdui from 'mdui';
import './normalize.css';
import './mdui.css';
import './index.css';
import shortlink from './shortlink.js';
var $ = mdui.$;
window.$ = mdui.$;
$('title').html(location.host);
$('.mdui-typo-headline').html(location.host);
$('#short').on('click', async () => {
  if ($('#need_shorturl').val() === '') {
    return;
  }
  try {
    new URL($('#need_shorturl').val());
  } catch (e) {
    try {
      new URL('http://' + $('#need_shorturl').val());
    } catch (e) {
      return;
    }
    $('#need_shorturl').val('http://' + $('#need_shorturl').val());
  }
  const url = $('#need_shorturl').val();
  mdui.updateTextFields();
  let Loading = mdui.dialog({
    title: 'Loading...',
    content: '<div class="mdui-spinner mdui-theme-pink"></div>',
    buttons: [],
    closeOnEsc: false,
  });
  mdui.mutation();
  let a = new shortlink(url, `${window.location.origin}/api/jsonrpc`);
  let answer = await a.random();
  console.log(answer);
  Loading.close();
  mdui.dialog({
    title: 'Shortened URL Created',
    content: `<div class="mdui-textfield mdui-textfield-floating-label">
    <i class="mdui-icon material-icons">link</i>
    <label class="mdui-textfield-label">Shortened URL</label>
    <input class="mdui-textfield-input" type="url" value="${answer}" disabled/>
    </div>`,
    buttons: [
      {
        text: '确认',
      },
    ],
  });
  mdui.updateTextFields();
});
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js', {
      scope: '/',
    })
    .then(function (registration) {
      console.log(
        'ServiceWorker registration successful with scope: ',
        registration.scope,
      );
    })
    .catch(function (err) {
      console.warn('ServiceWorker registration failed: ', err);
    });
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) {
      return;
    }
    refreshing = true;
    alert('正在更新Service Worker版本 请稍后……');
    console.log('Service Worker 更新中……');
    window.location.reload();
  });
}