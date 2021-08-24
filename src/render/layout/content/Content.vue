<template>
  <splitpanes class="layout-content default-theme" horizontal :push-other-panes="false">
    <pane>
      <splitpanes class="layout-content default-theme">
        <pane min-size="8" max-size="20" size="12">
          <SideTree />
        </pane>
        <pane>
          <Tabs />
        </pane>
        <!-- <pane min-size="8" max-size="20" size="15">
          <Information />
        </pane> -->
      </splitpanes>
    </pane>
  </splitpanes>
  <!-- <splitpanes class="layout-content default-theme">
    <pane min-size="8" max-size="20" size="12">
      <SideTree />
    </pane>
    <pane>
      <Tabs />
    </pane>
    <pane min-size="8" max-size="20" size="15">
      <Information />
    </pane>
  </splitpanes> -->
</template>

<script lang="ts" setup>
import Splitpanes from 'splitpanes/src/components/splitpanes/splitpanes.vue'
import Pane from 'splitpanes/src/components/splitpanes/pane.vue'
import Tabs from './tabs/Tab.vue'
// import Information from './information/Infomation.vue'
import SideTree from './sideTree/SideTree.vue'
</script>

<style lang="less" scoped>
.layout-content {
  height: 100%;
  width: 100%;
}
</style>
