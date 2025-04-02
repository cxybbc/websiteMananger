// src/utils/editor.js
import { createEditor, createToolbar } from '@wangeditor/editor'
const customMenus = {
    customImageWidth: {
        key: 'customImageWidth',
        factory() {
            return {
                title: '自定义尺寸',
                tag: 'button',

                exec(editor, value) {
                    const selectedElem = editor.selection.getSelectedElems()[0]
                    if (!selectedElem) return

                    const imgElement = selectedElem.nodeName === 'IMG'
                        ? selectedElem
                        : selectedElem.querySelector('img')

                    if (imgElement) {
                        const width = prompt('请输入图片宽度（如：300px 或 50%）:', '300px')
                        if (width) {
                            imgElement.style.width = width
                            imgElement.style.height = 'auto'
                        }
                    }
                }
            }
        }
    }
}
export function initEditor(options = {}) {
    // 注册自定义菜单
    Object.keys(customMenus).forEach(key => {
        if (!createEditor.getMenuConfig(key)) {
            createEditor.registerMenu(customMenus[key])
        }
    })

    return {
        editorConfig: {
            placeholder: '请输入内容...',
            MENU_CONF: {
                uploadImage: {
                    server: '/api/upload',
                    // ... 其他上传配置
                },
                ...options
            },
            hoverbarKeys: {
                image: {
                    menuKeys: [
                        'customImageWidth',
                        'editImage',
                        'deleteImage'
                    ]
                }
            }
        },
        toolbarConfig: {
            // 工具栏配置
        }
    }
}