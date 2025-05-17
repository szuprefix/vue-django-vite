<template>
    <div class="login-container">
        <div class="login-form">
            <el-row>
                <el-col :span="12" style="text-align: center">
                    <img :src="party.logo" v-if="party.logo" style="max-height: 100px;">
                    <h2>{{ party.name }}</h2>
                    <h3>{{ system_name }}</h3>
                </el-col>
                <el-col :span="12">

                    <x-form url="/auth/user/login/" v-model="form" :items="items" ref="form" size="big"
                            :itemOptions="{noLabel:true}" submitName="登录"
                            :noLabel="true" :hide-required-asterisk="true" @form-posted="done">
                        <div slot="header">帐号密码登录</div>
                    </x-form>
                    <el-divider></el-divider>
                    微信扫码登录
                    <q-r-form @form-posted="done"></q-r-form>
                </el-col>
            </el-row>

        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex'
import XForm from '../../components/form/Form.vue'
import {setToken} from '../../utils/auth'
import QRForm from "vue-django/src/views/auth/components/QRForm.vue"

const AUTH_STORAGE_NAME = 'auth.username'
import ServerResponse from '../../mixins/server_response'

export default {
    mixins: [ServerResponse],
    data() {
        return {
            form: {username: localStorage.getItem(AUTH_STORAGE_NAME), password: ''},
            items: [
                {name: 'username', required: true, label: '帐号', span: 24, icon: 'user', 'label-width': '0px'},
                {
                    name: 'password',
                    required: true,
                    label: '密码',
                    widget: 'password',
                    icon: 'lock',
                    span: 24,
                    onChanged: this.submit
                }
            ]
        }
    },
    components: {
        XForm,
        QRForm
    },
    methods: {
        done(data) {
            setToken(data.token.access)
            this.$store.dispatch('getUserInfo').then(() => {
                localStorage.setItem(AUTH_STORAGE_NAME, data.username)
                this.$router.replace(this.$route.query.redirect || '/')
            }).catch(this.onServerResponseError)
        },
        submit() {
            this.$refs.form.onSubmit()
        }
    },
    computed: mapState(['user', 'party', 'system_name'])
}
</script>
<style lang="less">
.login-container {
    position: fixed;
    height: 100%;
    width: 100%;

    .login-form {
        position: absolute;
        left: 0;
        right: 0;
        width: 960px;
        padding: 35px 35px 15px 35px;
        margin: 120px auto;

        .qrcode {
            max-width: 160px;
            max-height: 160px;
        }
    }
}


</style>
