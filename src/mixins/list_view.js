/**
 * Created by denishuang on 2018/2/28.
 */
import Qs from 'qs'
import filters from '../utils/filters'
import ServerResponse from './server_response'
import {Register} from '../utils/app_model'
export default{
    props: {
        tab: Object
    },
    data () {
        return {
            url: null,
            queries: {},
            table: [],
            pageSize: 20,
            page: 1,
            count: 0,
            model: {},
            appModelName: null
        }
    },
    mixins: [ServerResponse],
    modelTableFilters: filters,
    created () {
        this.$store.state.bus.$on('model-posted', this.onModelPosted)
        this.$store.state.bus.$on('model-deleted', this.onModelPosted)
    },
    mounted () {
        this.model = Register.get(this.appModelName)
        if (this.url == null) {
            this.url = this.model.listUrl
        }
        this.updateQueries({page: 1, page_size: this.pageSize, search: ''})
        // console.log(this.$store)
    },
    beforeDestroy () {
        this.$store.state.bus.$off('model-posted', this.onModelPosted)
    },
    components: {},
    methods: {
        onModelPosted ({model}) {
            if (model.fullName === this.model.fullName || (this.model.dependents && this.model.dependents.indexOf(model.fullName) >= 0)) {
                this.load()
            }
        },
        updateQueries (d) {
            this.queries = Object.assign({}, this.queries, d)
        },
        load () {
            let d = this.queries
            this.loading = '查询中'
            this.$http.get(`${this.url}?${Qs.stringify(d)}`).then(({data}) => {
                this.table = data.results
                this.count = data.count
                this.loading = false
                this.$emit('loaded', data)
                this.onLoaded(data)
            }).catch(this.onServerResponseError)
        },
        onLoaded (data) {
            // console.log('onLoaded')
        },
        onSearch () {
            this.updateQueries({})
        },
        onRowSelect (row, column, cell, event) {
            this.toEditModel(row, column, cell, event)
        },
        toEditModel (row, column, cell, event) {
            const path = `${row.id}`
            this.$router.replace(path)
            this.resolveCurrentTagLabel(path, `${row.__str__}`)
        },
        toCreateModel () {
            let url = `/${this.model.listUrl}create?${this.model.title_field}=${this.queries.search}`
            this.$router.push(url)
            this.resolveCurrentTagLabel(url, `新增${this.model.verbose_name}`)
        },
        onPageChanged (val) {
            this.page = val
        },
        onPageSizeChanged (val) {
            this.pageSize = val
        }
    },
    computed: {},
    watch: {
        page (newVal, oldVal) {
            this.updateQueries({page: newVal})
        },
        pageSize (newVal, oldVal) {
            this.updateQueries({page_size: newVal})
        },
        queries (newVal, oldVal) {
            this.load()
        }
    }
}
