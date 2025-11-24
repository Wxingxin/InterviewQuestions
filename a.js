function ajax(options){
  return new Promise((resolve,reject) => {
    const xhr = new XMLHttpRequest()

    const defaluts = {
      url:"",
      method: "GET",
      data:null,
      headers:{}
    }

    const opts = Object.assign({},defaluts,optiions)

    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
        if(xhr.status >= 200 && xhr.status < 300){
          try {
            resolve(JSON.parse(xhr.responseText))
          } catch (error) {
            resolve(xhr.responseText)
          }
        } else {
          reject({status:xhr.status,message:xhr.statusText})
        }
      }
    }
  })
}