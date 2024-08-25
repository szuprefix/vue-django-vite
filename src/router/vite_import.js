const modules = {
    ...import.meta.glob("/src/views/**/**.vue"),
    ...import.meta.glob("/src/views/**/config.js"),
    ...import.meta.glob("../views/model/**.vue"),
}
console.log('vite_import', modules)

export default file => {
    let f = file.replaceAll('//', '/')
    let m = modules[f]
    if(!m) {
        return
    }
    console.debug(`using modual: ${m}`)
    return m
    // return  || Promise.reject()
}
