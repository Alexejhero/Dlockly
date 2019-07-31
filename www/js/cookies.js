'use strict';

function setCookie(cname, cvalue, exdays = 365) {
  var d = new Date();
  new Date(Date.now() +1000 * 60 * 60 * 24 * 365)
  d.setTime(d.getTime() + ());
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = decodeURIComponent(document.cookie).split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function cookieExists(cname) {
  return getCookie(cname) && getCookie(cname) != "";
}