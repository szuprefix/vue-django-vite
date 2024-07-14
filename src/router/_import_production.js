// const modules = import.meta.glob("@/views/**/**.vue")

export default file => () => import('@/views/' + file + '.vue'/* @vite-ignore */)
// export default file => modules['/src/views/' + file + '.vue']
