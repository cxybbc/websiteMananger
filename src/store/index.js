import Vue from 'vue'
import Vuex from 'vuex'
import router, { resetRouter } from "@/router";
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        currentPathName: '',
        recruitmentTypeList: [],//职位分类列表
        webSiteList: [],//网站列表
    },
    mutations: {
        setPath(state) {
            state.currentPathName = localStorage.getItem("currentPathName")
        },
        logout() {
            // 清空缓存
            localStorage.removeItem("user")
            localStorage.removeItem("menus")
            router.push("/login")

            // 重置路由
            resetRouter()
        },
        setRecruitmentTypeList(state, list) {
            state.recruitmentTypeList = list
        },
        setWebSiteList(state, list) {
            state.webSiteList = list
        }
    }
})

export default store
