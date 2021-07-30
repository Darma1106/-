<template>
  <MyIcon :type="iconType" />
</template>

<script lang="ts">
import { createFromIconfontCN } from '@ant-design/icons-vue'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2431681_jyp8pbbxa9.js'
})

export enum iconFont {
  '文件夹' = 'iconwenjianjia',
  '模型' = 'iconmodel',
  '字体' = 'iconziti',
  '粘贴' = 'iconniantie',
  '倾斜' = 'iconqingxie',
  '剪切' = 'iconjianqie',
  '加粗' = 'iconjiacu',
  '撤销' = 'iconchexiao',
  '转换' = 'iconzhuanhuan',
  '复位' = 'iconfuwei1',
  '暂停' = 'iconzanting',
  '运行' = 'iconyunhang',
  '后退' = 'iconprev',
  '前进' = 'iconnext',
  '折线' = 'iconzhexian',
  '任务' = 'icontutuzhushou-_',
  '文本' = 'iconfile',
  '12三角形' = 'iconsanjiaoxing',
  '消息' = 'icondibudaohanglan-',
  '图形-直线' = 'iconzhixian_huaban1',
  '矩形' = 'iconjuxing',
  '关闭' = 'icondaochushujufuzhi',
  '打开' = 'icondakaixinxi',
  '新模型' = 'iconliuchengtu',
  '流程图' = 'iconliuchengtu',
  '播放' = 'iconbofang-',
  '层级' = 'iconcengji',
  '填充' = 'iconyouqitong',
  '阴影分析' = 'iconyinyingfenxi',
  '布局' = 'iconbuju',
  '校验' = 'iconxiaoyan',
  '居右对齐' = 'iconjuyouduiqi',
  '水平等间距' = 'iconshuipingdengjianju',
  '居下对齐' = 'iconjuxiaduiqi',
  '垂直等间距' = 'iconchuizhidengjianju',
  '居上对齐' = 'iconjushangduiqi',
  '居左对齐' = 'iconjuzuoduiqi',
  '文本居右对齐' = 'iconwenbenjuyouduiqi',
  '文本左对齐' = 'iconwenbenzuoduiqi',
  '文本居中对齐' = 'iconwenbenjuzhongduiqi',
  '上一层' = 'iconshangyiceng',
  '下一层' = 'iconxiayiceng',
  '置顶' = 'iconcangpeitubiao_zhiding',
  '置底' = 'iconcangpeitubiao-zhidi',
  '保存' = 'iconbaocun'
}

type IconType = iconFont

export default defineComponent({
  components: { MyIcon },
  props: {
    iconType: {
      type: String as PropType<IconType>,
      default: ''
    }
  }
})
</script>

<style lang="less" scoped></style>
