<template>
  <div class="part-one">
    <div>PartOne</div>
    <h2>1111</h2>
    <a-upload
      v-model:file-list="fileList"
      :open-file-dialog-onclick="true"
      name="file"
      :multiple="true"
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      :headers="headers"
      @change="handleChange"
    >
      <a-button>
        <upload-outlined></upload-outlined>
        Click to Upload
      </a-button>
    </a-upload>
  </div>
</template>

<script lang="ts">
import { message } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import { defineComponent, ref } from 'vue'

interface FileItem {
  uid: string
  name?: string
  status?: string
  response?: string
  url?: string
}

interface FileInfo {
  file: FileItem
  fileList: FileItem[]
}

export default defineComponent({
  components: {
    UploadOutlined
  },
  setup() {
    const handleChange = (info: FileInfo) => {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    }

    const fileList = ref([])
    return {
      fileList,
      headers: {
        authorization: 'authorization-text'
      },
      handleChange
    }
  }
})
</script>

<style lang="less" scope>
.part-one {
  border: 2px solid red;
  height: 100%;
}
</style>
