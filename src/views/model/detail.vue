<template>

    <model-descriptions :appModel="appModel" v-model="data" ref="table" @loaded="onLoaded">
        <template v-slot:bottom="{model}">
            <template v-if="model.viewsConfig && model.data.id">
                <el-collapse v-model="activePanels" v-if="model.viewsConfig.pannels">
                    <el-collapse-item :title="p.label" :name="i" v-for="(p,i) in model.viewsConfig.pannels"
                                      :key="p.name">
                        <component :is="p.component" v-bind="[p]" :parent="model"></component>
                    </el-collapse-item>
                </el-collapse>

            </template>
            <model-relations v-if="model.data.id && model.viewsConfig"
                             :parent="model"></model-relations>
        </template>
    </model-descriptions>
</template>
<script>
    import ModelDescriptions from '../../components/model/Descriptions.vue'
    import ModelRelations from '../../components/model/Relations.vue'
    import server_response from '../../mixins/server_response'
    export default{
        props: {
            tab: Object,
            id: [Number, String],
        },
        data () {
            return {
                data: {},
                appModel: '',
                model: null,
                activePanels: [0]
            }
        },
        mixins: [server_response],
        components: {
            ModelDescriptions, ModelRelations
        },

        created () {
            let ps = this.$route.path.split('/')
            this.appModel = `${ps[1]}.${ps[2]}`
        },
        methods: {
            onLoaded (model) {
                this.model = model
                this.data = {...model.data}
            },
            setTitle(p){
                this.tab.title = this.$refs.table.model.title()
            },
        },
        watch: {

            data (val) {
                this.setTitle()
            },

        }
    }
</script>
