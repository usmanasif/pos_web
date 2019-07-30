
const hostname = window && window.location && window.location.hostname;
var arr = hostname.split('.')

var url = "";

if(arr.length > 1 && arr[1] + '.' + arr[2] == 'lvh.me'){
  url = "http://" + hostname + ":3000"
}

export const apiUrl = url;
