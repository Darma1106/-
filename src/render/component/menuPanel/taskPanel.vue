<template>
  <div class="schema-panel">
    <menu-panel-template :panelConfig="shemaPanelConfig" ref="schemaPanel" />
  </div>
</template>

<script>
import menuPanelTemplate from './menuPanelTemplate'
import { itemName } from '@/common/constant/constant.js'

export default {
  name: 'SchemaPanel',
  components: {
    menuPanelTemplate
  },
  data() {
    const shemaPanelConfig = [
      [
        {
          icon: 'iconaddnew',
          iconColor: '#d7d7d7',
          title: '新建',
          disable: false,
          name: itemName.ADD,
          type: 'selectButton',
          contextmenu: [
            // {
            //   title: '评估任务',
            //   name: itemName.TASK_NEW,
            //   disable: false
            // },
            {
              title: '评估方案',
              name: itemName.SCHEMA_NEW,
              disableMItem: false
            }
            // ,
            // {
            //   title: '评估结果',
            //   name: 'addResult',
            //   disableMItem: false
            // }
          ]
        }
      ],
      // [
      //   {
      //     icon: 'icondakai',
      //     iconColor: '#FF9900',
      //     title: '打开',
      //     disable: false,
      //     name: itemName.TASK_OPEN,
      //     type: 'buttonItem'
      //   }
      // ],
      [
        {
          icon: 'iconbianji',
          iconColor: '#669999',
          title: '编辑',
          disable: true,
          name: itemName.EDIT,
          type: 'buttonItem'
        }
      ],
      [
        {
          icon: 'iconbaocun',
          iconColor: '#669999',
          title: '保存',
          disable: true,
          name: itemName.SAVE,
          type: 'buttonItem'
        }
      ],
      [
        {
          icon: 'iconicon_close',
          disable: true,
          title: '删除',
          name: itemName.DELETE,
          type: 'buttonItem'
        }
      ],
      [
        {
          icon: 'iconhuoqu',
          disable: true,
          title: '获取数据',
          name: itemName.SCHEMA_SELECT,
          type: 'buttonItem'
        }
      ]
    ]
    return { shemaPanelConfig }
  }
}
</script>

<style></style>
