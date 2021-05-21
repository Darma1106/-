<template>
  <div class="select-item">
    <span style="color:#cccccc;">{{ itemInfo.title }}</span>
    <el-select v-model="selectValue" placeholder="请选择" @change="selectChange">
      <el-option v-for="item in itemInfo.options" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'SelectItem',
  data() {
    return {
      selectValue: ''
    }
  },
  props: {
    itemInfo: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    console.log(this.itemInfo)
  },
  methods: {
    selectChange(val) {
      this.$store.dispatch('event/emit', {
        name: 'calculate-select-scene',
        options: {
          value: val
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.select-item {
  .el-input {
    width: 140px !important;
    margin-left: 4px;
    height: 25px;
  }
  .el-input__inner {
    width: 140px !important;
    margin-left: 4px;
    height: 25px;
  }
  .el-input--suffix .el-input__inner {
    width: 140px !important;
    margin-left: 4px;
    height: 25px;
  }
  .el-input__icon {
    height: 116%;
  }
}
</style>
