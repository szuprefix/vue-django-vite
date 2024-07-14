const modules = {
    ...import.meta.glob("/src/views/**/**.vue"),
    ...import.meta.glob("/src/views/**/config.js")
}
console.log('vite_import', modules)

export default file => {
    let m = modules[file]
    if(!m) {
        return
    }
    console.log(`import model: ${m}`)
    return m()
    // return  || Promise.reject()
}
