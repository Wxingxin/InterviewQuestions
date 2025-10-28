Function.prototype.mycall = function(context,...args){
    if(typeof this !== "function"){
        throw new TypeError("mycall must be called on")
    }

    context = context ?? globalThis
    context = Object(context)

    const fnkey= Symbol("fn")

    context[fnkey] = this;

    try {
        return context[fnkey](...args)
    } finally {
        delete context[fnkey]
    }
}