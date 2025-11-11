function ajax(options) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const defaluts = {
      url: "",
      method: "GET",
      data: null,
      Headers: {},
    };

    const opts = Object.assign({},defaluts,options)
    if(opts.method.toUpperCase() === "GET" && opts.data){

    }
    
    for(const key in opts.Headers){
      xhr.setRequestHeader(key,opts.Headers[key])
    }

    xhr.open(opts.method,opts.url,true)

    xhr.send(

    )
  });
}
