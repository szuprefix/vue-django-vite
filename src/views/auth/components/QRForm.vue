<script>

import AsyncResult from 'vue-django/src/utils/async_result'
import QRCode from 'qrcode'
export default {
    data() {
        return {
            qrcodeUrl: null
        }
    },
    created () {
        this.init()
    },
    methods: {
        init(){
            this.$http.get('/wechat/mp/login_qrcode/').then(({data}) => {
                this.qrcodeUrl = data.url
                return data.task
            }).then(task => {
                return AsyncResult(task).monitor()
            }).then(rs => {
                return rs.result // this.$http.post(this.formUrl, rs.result)
            }).then(this.done).catch(this.onServerResponseError)
        },
        done(data) {
            this.$emit('form-posted', data)
        }

    },
    watch: {
        qrcodeUrl (v) {
            let e = this.$refs.qr
            console.log(e)
            QRCode.toCanvas(e,  v)
        }
    }
}
</script>

<template>
    <div>
        <canvas ref="qr" class="qrcode"></canvas>
    </div>
</template>

<style scoped>

</style>