<template>
  <div class="detail-bar">
    <a-form layout="inline" :model="formState">
      <a-form-item label="字体">
        <a-select v-model:value="formState.fontFamily" placeholder="please select your zone">
          <a-select-option value="song">宋体</a-select-option>
          <a-select-option value="hei">黑体</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="字号">
        <a-select v-model:value="formState.fontSize" placeholder="please select your zone">
          <a-select-option value="20">20</a-select-option>
          <a-select-option value="22">22</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item>
        <a-divider type="vertical" style="height: 20px; padding-top: 10px; background-color: #000" />
      </a-form-item>

      <a-form-item title="字体">
        <SwitchButton v-model:checked="formState.xieti"><BaseIcon :type="iconFont.字体" /> </SwitchButton>
      </a-form-item>
      <a-form-item title="斜体">
        <SwitchButton v-model:checked="formState.xieti"><BaseIcon :type="iconFont.倾斜" /> </SwitchButton>
      </a-form-item>
      <a-form-item title="粗体">
        <SwitchButton v-model:checked="formState.jiacu"><BaseIcon :type="iconFont.加粗" /> </SwitchButton>
      </a-form-item>

      <a-form-item>
        <a-radio-group v-model:value="formState.ailgn">
          <a-radio-button value="left" title="左侧对齐"><AlignLeftOutlined /></a-radio-button>
          <a-radio-button value="center" title="居中对齐"><AlignCenterOutlined /></a-radio-button>
          <a-radio-button value="right" title="右侧对齐"><AlignRightOutlined /></a-radio-button>
        </a-radio-group>
      </a-form-item>

      <a-form-item>
        <a-divider type="vertical" style="height: 20px; padding-top: 10px; background-color: #000" />
      </a-form-item>

      <a-form-item label="边框">
        <a-input v-model:value="formState.fieldB" :maxlength="1" />
      </a-form-item>

      <a-form-item> <input v-model="color" type="color" class="color-picker" /> </a-form-item>

      <a-form-item>
        <a-divider type="vertical" style="height: 20px; padding-top: 10px; background-color: #000" />
      </a-form-item>

      <a-form-item label="h">
        <a-input v-model:value="formState.fieldB" />
      </a-form-item>

      <a-form-item label="w">
        <a-input v-model:value="formState.fieldB" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { AlignLeftOutlined, AlignCenterOutlined, AlignRightOutlined } from '@ant-design/icons-vue'
import BaseIcon, { iconFont } from '@/component/baseIcon/BaseIcon.vue'
import SwitchButton from '@/component/panelItem/switchButton.vue'

interface FormState {
  layout: 'horizontal' | 'vertical' | 'inline'
  ailgn: 'left' | 'right' | 'center'
  fontFamily: string
  fontSize: string
  fieldA: string
  fieldB: string
  xieti: boolean
  jiacu: boolean
}
export default defineComponent({
  components: {
    SwitchButton,
    AlignLeftOutlined,
    AlignCenterOutlined,
    AlignRightOutlined,
    BaseIcon
  },
  setup() {
    const formState = ref<FormState>({
      fontFamily: 'song',
      fontSize: '22',
      layout: 'inline',
      ailgn: 'center',
      fieldA: '',
      fieldB: '3',
      xieti: false,
      jiacu: false
    })
    const color = ref('')
    return {
      formState,
      color,
      iconFont
    }
  }
})
</script>

<style lang="less" scoped>
.detail-bar {
  display: flex;
  flex-direction: row;
  ::v-deep(.ant-input) {
    width: 30px;
    background-color: transparent;
    border: none;
    outline: none;
    box-shadow: none;
    border-bottom: 1px solid #000;
  }

  ::v-deep(.ant-select-selector, .ant-select-selection) {
    border: none;
    box-shadow: none;
  }

  ::v-deep(.ant-radio-button-wrapper, .ant-radio-button-wrapper-checked) {
    background-color: transparent;
  }

  .color-picker {
    width: 20px;
  }
}
</style>
