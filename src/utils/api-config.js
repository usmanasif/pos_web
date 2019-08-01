
const hostname = window && window.location && window.location.hostname;
var arr = hostname.split('.')

var url = "";

if(arr[1] === "herokuapp"){
  url = "https://devsinc.herokuapp.com"
} else if((arr.length === 3 && arr[1] + '.' + arr[2] === 'lvh.me') || (arr.length === 2 && arr[0] + '.' + arr[1] === 'lvh.me')){
  url = "http://" + hostname + ":3000"
}

export const apiUrl = url;
