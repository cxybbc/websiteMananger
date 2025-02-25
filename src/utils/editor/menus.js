// src/utils/editor/menus.js
import { Boot } from '@wangeditor/editor'

// 全局变量存储当前选中的图片
let selectedImage = null

// 创建基础菜单工厂
function createSizeMenu(title, width) {
    return {
        title,
        tag: 'button',

        getValue() {
            return ''
        },

        isActive() {
            return false
        },

        // 检查是否有选中的图片
        isDisabled() {
            return !selectedImage
        },

        // 执行尺寸调整
        exec() {
            if (!selectedImage) return
            selectedImage.style.width = width
            selectedImage.style.height = 'auto'
        }
    }
}

// 注册菜单
const menus = {
    image75: {
        key: 'image75',
        factory() {
            return createSizeMenu('75%宽度', '75%')
        }
    },
    image25: {
        key: 'image25',
        factory() {
            return createSizeMenu('25%宽度', '25%')
        }
    },
    imageResize: {
        key: 'imageResize',
        factory() {
            return {
                title: '自定义尺寸',
                tag: 'button',

                getValue() {
                    return ''
                },

                isActive() {
                    return false
                },

                isDisabled() {
                    return !selectedImage
                },

                exec() {
                    if (!selectedImage) return
                    const width = prompt('请输入图片宽度（如：300px 或 50%）:', selectedImage.style.width || '300px')
                    if (width) {
                        selectedImage.style.width = width
                        selectedImage.style.height = 'auto'
                    }
                }
            }
        }
    }
}

// 注册所有菜单
Object.values(menus).forEach(menu => {
    Boot.registerMenu(menu)
})

// 导出编辑器配置
export const editorConfig = {
    MENU_CONF: {},
    hoverbarKeys: {
        image: {
            menuKeys: ['image75', 'image25', 'imageResize', 'editImage', 'deleteImage']
        }
    }
}

// 在组件中使用的初始化函数
export function initImageEvents(editor) {
    // 获取编辑器容器
    const container = editor.getEditingArea?.() ||
        document.querySelectorAll('.w-e-text-container')[1]
    console.log('container', container);
    if (!container) return

    // 添加图片点击事件
    container.addEventListener('click', (e) => {
        // 清除之前的选中状态
        const prevSelected = container.querySelectorAll('img.w-e-selected')[1]
        if (prevSelected) {
            prevSelected.classList.remove('w-e-selected')
        }

        // 如果点击的是图片
        if (e.target.tagName === 'IMG') {
            selectedImage = e.target
            selectedImage.classList.add('w-e-selected')
            e.stopPropagation()
        } else {
            selectedImage = null
        }
    })

    // 点击其他地方取消选中
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            const selected = container.querySelectorAll('img.w-e-selected')[1]
            if (selected) {
                selected.classList.remove('w-e-selected')
            }
            selectedImage = null
        }
    })
}