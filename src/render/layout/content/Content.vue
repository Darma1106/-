<template>
  <splitpanes class="default-theme" style="height: 100%">
    <pane min-size="8" max-size="20" size="12">
      <SideTree />
    </pane>
    <pane>
      <Tabs />
    </pane>
    <pane min-size="8" max-size="20" size="15">
      <Information />
    </pane>
  </splitpanes>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Splitpanes from 'splitpanes/src/components/splitpanes/splitpanes.vue'
import Pane from 'splitpanes/src/components/splitpanes/pane.vue'
import Tabs from './tabs/Tab.vue'
import Information from './information/Infomation.vue'
import SideTree from './sideTree/SideTree.vue'
export default defineComponent({
  components: { Tabs, Information, SideTree, Splitpanes, Pane }
})
</script>

<style lang="less" scoped>
.layout-content {
  height: 100%;
  display: flex;
  flex-direction: row;
  .center {
    flex: 1;
  }
  .right {
    width: 260px;
    border-left: 1px solid #000;
  }
}
</style>
