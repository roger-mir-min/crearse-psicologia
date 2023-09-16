  export function encodeHTML(str:string) {
    return str.replace(/&/g, "&amp");
  }