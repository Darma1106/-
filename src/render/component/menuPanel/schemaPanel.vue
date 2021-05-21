<template>
  <div class="schema-panel">
    <menu-panel-template :panelConfig="shemaPanelConfig" ref="schemaPanel" />
  </div>
</template>

<script>
import menuPanelTemplate from './menuPanelTemplate'

import { itemName } from '@/common/constant/constant.js'
import router from '@/router'

export default {
  name: 'SchemaPanel',
  components: {
    menuPanelTemplate
  },
  data() {
    function schemaEdit() {
      router.push({ name: 'schemaProperty' })
    }
    const shemaPanelConfig = [
      [
        {
          icon: 'iconaddnew',
          iconColor: '#d7d7d7',
          title: '新建',
          disable: false,
          name: itemName.SCHEMA_NEW,
          type: 'buttonItem'
        }
      ],
      [
        {
          icon: 'icondakai',
          iconColor: '#FF9900',
          title: '打开',
          disable: false,
          name: itemName.SCHEMA_OPEN,
          type: 'buttonItem'
        }
      ],
      [
        {
          icon: 'iconbianji',
          iconColor: '#669999',
          title: '编辑',
          click: schemaEdit,
          disable: false,
          name: itemName.SCHEMA_OPTION,
          type: 'buttonItem'
        }
      ],
      [
        {
          icon: 'iconbaocun',
          iconColor: '#669999',
          title: '保存',
          disable: false,
          name: itemName.SCHEMA_SAVE,
          type: 'buttonItem'
        }
      ],
      [
        {
          icon: 'iconicon_close',
          disable: false,
          title: '关闭',
          name: itemName.SCHEMA_CLOSE,
          type: 'buttonItem'
        }
      ]
    ]
    return { shemaPanelConfig }
  },
  methods: {
    fff() {
      this.$refs['schemaPanel'].setPanelItemState(['indicator-new', 'indicator-save'], true)
      console.log(this.$refs['schemaPanel'])
    }
  }
}
</script>

<style></style>
