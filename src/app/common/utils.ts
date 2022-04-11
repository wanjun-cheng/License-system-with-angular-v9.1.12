import { KEY_TOKEN } from './constant';


/**
 * 获取token
 */
export function getToken(): string {
  return window.sessionStorage.getItem(KEY_TOKEN);
}

/**
 * 设置token
 * @param token 设置token的值
 */
export function setToken(token: string) {
  window.sessionStorage.setItem(KEY_TOKEN, token);
}

/**
 * 设置cookie
 * @param name 设置cookie key
 * @param value 设置cookie value
 * @param expiredays 设置cookie 过期时间
 */
export function setCookie(name, value, expiredays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie = name + "=" + escape(value) + ";expires=" + exdate.toUTCString();
}

/**
 * 获取cookie
 */
export function getCookie(name) {
  var strcookie = document.cookie;//获取cookie字符串
  var arrcookie = strcookie.split("; ");//分割
  //遍历匹配
  for (var i = 0; i < arrcookie.length; i++) {
    var arr = arrcookie[i].split("=");
    if (arr[0] == name) {
      return arr[1];
    }
  }
  return "";
}

/**
 * 清除cookie
 */
export function clearCookie(name) {
  setCookie(name, "", -1);
}

/**
 * 下载blob流
 * @param blob blob流内容
 * @param fileName 文件名
 */
export function blobDownload(blob, fileName) {
  const newBlob = new Blob([blob], {
    type: "application/octet-stream",
  });
  const objectUrl = URL.createObjectURL(newBlob);
  const link = document.createElement("a");
  document.body.appendChild(link);
  link.setAttribute("style", "display:none");
  link.setAttribute("href", objectUrl);
  link.setAttribute("download", fileName);
  link.click();
  URL.revokeObjectURL(objectUrl);
}