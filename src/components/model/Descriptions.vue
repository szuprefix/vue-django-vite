<template>
    <div>
        <el-descriptions :column="3" border :title="formValue[titleField || 'name']" labelStyle="text-wrap: nowrap;" style="margin: 1rem;">
            <template slot="extra">
                <el-button type="primary" size="small">操作</el-button>
            </template>
            <el-descriptions-item v-for="f in fieldItems" :key="f.name" v-bind="[f]">
                <widget :field="f" :value="formValue" :context="formValue" :key="f.name"></widget>
            </el-descriptions-item>
        </el-descriptions>
        <slot name="bottom" :model="model"></slot>
    </div>
</template>
<script>

    import {percent, toThousandslsFilter, json} from '../../utils/filters'
    import Model from './Model'
    import ServerResponse from '../../mixins/server_response'
    import arrayNormalize from '../../utils/array_normalize'
    import Actions from '../layout/Actions.vue'
    import RelatedSelect from './Select.vue'
    import Widget from '../table/Widget.vue'
    import TrueFlag from '../widgets/TrueFlag.vue'
    import ChoicesDisplay from '../widgets/ChoicesDisplay.vue'
    import Date2Now from '../widgets/Date2Now.vue'
    import {get} from 'lodash'
    export default{
        mixins: [ServerResponse],
        components: {Actions, Widget},
        props: {
            appModel: String,
            items: Array,
            value: Object,
            defaults: {
                type: Object, default: () => {
                    return {}
                }
            },
            options: {
                type: Object,
                default: () => {
                    return {}
                }
            },
            topActions: Array
        },
        data () {
            return {
                fieldItems: [],
                formValue: {},
                intent: '',
                title: '',
                successInfo: undefined,
                model: Model(this.appModel, this.defaults, this.$store.state.bus),
            }
        },
        created(){
            this.init()
//                this.$on("model-delete", this.onDelete)
        },
        methods: {

            init(){
                this.mid = this.model.id = this.getId() || 1
//                this.formValue = this.value
                this.model.load().then((data, options) => {
                    this.title = this.model.options.verbose_name
                    this.mid = this.model.id
                    this.formValue = {...this.value, ...this.model.data}
                    this.normalizeItems()
                    this.$emit('loaded', this.model)
                }).catch(this.onServerResponseError)
            },
            getId(){
                let id = this.value && this.value.id ||
                    this.$route.path.startsWith(this.model.getListUrl()) && this.$route.params.id
                    || undefined
                return id === 'create' ? undefined : id
            },
            defaultWidget (f) {
                if (f.type == 'boolean') {
                    return TrueFlag
                } else if (['datetime'].includes(f.type)) {
                    return Date2Now
                } else if (f.choices) {
                    return ChoicesDisplay
                } else if (f.child) {
                    return function (value, field) {
                        let d = value[field.name]
                        let sfs = field.child.children
                        return d.map(r => Object.keys(sfs).map(sf => r[sf]).join(',')).join('\n')
                    }
                }
            },
            genDefaultFormatter (f) {
                if (f.type === 'field') {
                    return (row, column, cellValue, index) => json(cellValue, f.items)
                }
                let df = (v) => v
                let func = ['decimal', 'number', 'integer'].includes(f.type) && toThousandslsFilter || ['percent'].includes(f.type) && percent || df
                return (row, column, cellValue, index) => func(cellValue)
            },
            getItems () {
                if (this.items) {
                    return Promise.resolve(this.items)
                }
                return import(`@/views${this.model.getListUrl()}config.js`).then(m => {
                    let c = m.default
                    return c.display || c.update || c.create || c.form || {}
                }).catch(() => {
                    return {}
                }).then(config => {
                    return config.items || Object.values(this.model.options.actions.POST).filter(a => a.read_only !== true)
                })
            },
            normalizeItem(f)
            {
                if (typeof f === 'string') {
                    f = {name: f}
                }
                f.type = f.type || 'string'
                f.align = f.align || ['decimal', 'number', 'percent', 'integer'].includes(f.type) && 'right' || 'left'
                f.widget = f.widget || this.cellWidget || this.defaultWidget(f)
                f.formatter = f.formatter || this.genDefaultFormatter(f)
                return f
            },
            normalizeItems() {
                this.getItems().then(items => {
                    this.fieldItems = arrayNormalize(items, this.model.fieldConfigs, this.normalizeItem)
                })

            },
        },
        computed: {
            titleField() {
                return this.$attrs.titleField || '__str__'
            }
        }
    }
</script>
