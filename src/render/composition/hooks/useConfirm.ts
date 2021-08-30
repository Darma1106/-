import { Modal } from 'ant-design-vue'
import { h, createVNode } from 'vue'

interface ConfirmType {
  infoModal: (title: string, info: string) => void
  projectIsOpen: (projectName: string) => void
  userAdminDelete: () => void
  userAdminEdit: () => void
  loggedUserDelete: () => void
  loggedUserSwithState: () => void
  openedProjectDelete: () => void
  openProject: (projectName: string) => void
}

const admin = '超级管理员'

export default function useConfirm(): ConfirmType {
  const infoModal = (title: string, info: string) => {
    Modal.warning({
      title: title,
      content: h('div', {}, [h('p', info)]),
      okText: '确定',
      onOk() {
        console.log('ok')
      }
    })
  }

  const projectIsOpen = (projectName: string) => {
    infoModal('提示', `【${projectName}】已打开！`)
  }

  const userAdminDelete = () => {
    infoModal('提示', `【${admin}】为该软件工具默认角色，不可删除！`)
  }

  const userAdminEdit = () => {
    infoModal('提示', `【${admin}】为该软件工具默认角色，不可编辑！`)
  }

  const loggedUserDelete = () => {
    infoModal('提示', '当前登录用户不可删除！')
  }

  const loggedUserSwithState = () => {
    infoModal('提示', '当前登录用户不可切换状态！')
  }

  const openedProjectDelete = () => {
    Modal.confirm({
      title: '提示',
      // icon: createVNode(ExclamationCircleOutlined),
      content: createVNode(
        'div',
        {
          style: 'color:red;'
        },
        '当前项目已打开，是否仍要删除该项目?'
      ),

      onOk() {
        console.log('OK')
      },

      onCancel() {
        console.log('Cancel')
      },

      class: 'test'
    })
  }

  const openProject = (projectName: string) => {
    Modal.confirm({
      title: '提示',
      // icon: createVNode(ExclamationCircleOutlined),
      content: createVNode(
        'div',
        {
          style: 'color:red;'
        },
        `是否打开【${projectName}】`
      ),

      onOk() {
        console.log('OK')
      },

      onCancel() {
        console.log('Cancel')
      },

      class: 'test'
    })
  }

  return {
    infoModal,
    projectIsOpen,
    userAdminDelete,
    userAdminEdit,
    loggedUserDelete,
    loggedUserSwithState,
    openedProjectDelete,
    openProject
  }
}
