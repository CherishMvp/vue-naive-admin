<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/16 18:51:56
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <CommonPage show-footer>
    <template #action>
      <n-button type="primary" @click="handleAdd()">
        <i class="mr-4 i-material-symbols:add text-18" />
        新增成员
      </n-button>
    </template>
    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="apiClassPhoto.readMember"
    >
      <MeQueryItem label="寝室号" :label-width="80">
        <n-input
          v-model:value="queryItems.dormitoryId"
          type="text"
          placeholder="请输入寝室号"
          clearable
          @keydown.enter="() => $table?.handleSearch()"
        />
      </MeQueryItem>
      <MeQueryItem label="成员姓名" :label-width="80">
        <n-input
          v-model:value="queryItems.name"
          type="text"
          placeholder="请输入成员姓名"
          clearable
          @keydown.enter="() => $table?.handleSearch()"
        />
      </MeQueryItem>
    </MeCrud>
    <MeModal rounded-12 ref="modalRef">
      <n-form
        ref="modalFormRef"
        :model="modalForm"
        label-placement="left"
        label-align="left"
        :rules="rules"
        :label-width="100"
      >
        <n-form-item path="name" label="成员姓名">
          <n-input round v-model:value="modalForm.name" />
        </n-form-item>
        <n-form-item path="dormitoryId" label="寝室号">
          <!-- <n-select
            clearable
            v-model:value="modalForm.dormitoryId"
            :loading="loading"
            remote
            filterable
            placeholder="搜索寝室ID"
            @search="handleOptionsSearch"
            :options="options"
          ></n-select> -->
          <n-select
            rounded-12
            clearable
            v-model:value="modalForm.dormitoryId"
            :loading="loading"
            placeholder="搜索寝室ID"
            :options="options"
          ></n-select>
        </n-form-item>
        <n-form-item path="imageUrl" label="图片地址">
          <n-input
            rounded-12
            type="textarea"
            v-model:value="modalForm.imageUrl"
            placeholder="输入URL，一行一个"
          />
        </n-form-item>
      </n-form>
    </MeModal>
    <MeModal ref="$modal2" title="上一个弹窗提交的内容">
      <h2>{{ text }}</h2>
    </MeModal>
    <!-- <n-data-table :columns="columns" :data="data" :pagination="paginationReactive" /> -->
  </CommonPage>
</template>

<script setup>
import { MeModal, MeCrud, MeQueryItem } from '@/components'
import { ref, h, reactive } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'
import { apiClassPhoto } from '../api'
import { useCrud, useOptionsSearch } from '@/composables'

const { options, loading } = useOptionsSearch()
const $table = ref(null)

/** QueryBar筛选参数（可选） */
const queryItems = ref({})

function submitCallback() {
  $message.success('Submit')
}

const text = ref('')

const handleOptionsSearch = async () => {
  loading.value = true
  const res = await apiClassPhoto.getAllRoomIds()
  console.log('res', res)
  options.value = res.data.map((item) => {
    return { label: item.dormitoryId + '-' + item.title, value: item.dormitoryId }
  })
  console.log('options', options.value)
  loading.value = false
}

onMounted(() => {
  console.log('读取相册列表内容')
  // getAllPhotoList()
  // init()
  $table.value?.handleSearch()
  // 获取筛选内容
  handleOptionsSearch()
})

// 解构增删改操作
const { modalRef, modalFormRef, modalAction, modalForm, handleAdd, handleDelete, handleEdit } =
  useCrud({
    name: '寝室成员',
    doCreate: apiClassPhoto.createMember,
    doDelete: apiClassPhoto.deleteMember,
    doUpdate: apiClassPhoto.updateMember,
    initForm: { enable: true },
    refresh: () => $table.value?.handleSearch(),
  })

const paginationReactive = reactive({
  page: 2,
  pageSize: 5,
  showSizePicker: true,
  pageSizes: [3, 5, 7],
  onChange: (page) => {
    paginationReactive.page = page
  },
  onUpdatePageSize: (pageSize) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
  },
})
const rules = {
  name: [
    {
      required: true,
      validator(rule, value) {
        if (!value) {
          return new Error('需要成员姓名')
        } else if (value.length > 50) {
          return new Error('不能超过50个字符')
        }
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
  dormitoryId: [
    {
      required: true,
      message: '寝室号',
    },
  ],
  imageUrl: [
    {
      required: true,
      message: '请输入图片链接',
      trigger: ['input', 'blur'],
    },
  ],
}
const columns = [
  {
    title: '序号',
    key: 'id',
    align: 'center',
    render(row) {
      return '# ' + row.id
    },
  },
  {
    title: '成员姓名',
    key: 'name',
    align: 'center',
  },

  {
    title: '寝室号',
    key: 'dormitoryId',
    align: 'center',
    render(row) {
      return h(
        NTag,
        {
          style: {
            marginRight: '6px',
          },
          type: 'success',
          shape: 'round',
          bordered: false,
        },
        {
          default: () => row.dormitoryId,
        }
      )
    },
  },
  {
    title: '轮播图url',
    key: 'imageUrl',
    align: 'center',
    width: 420,
  },
  {
    title: '操作栏',
    key: 'actions',
    align: 'center',
    width: 320,
    fixed: 'right',

    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 12px;',
            disabled: row.code === 'SUPER_ADMIN',
            onClick: () => handleEdit(row),
          },
          {
            default: () => '编辑',
            icon: () => h('i', { class: 'i-fe:edit text-14' }),
          }
        ),

        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 12px;',
            disabled: row.code === 'SUPER_ADMIN',
            onClick: () => handleDelete(row.id),
          },
          {
            default: () => '删除',
            icon: () => h('i', { class: 'i-fe:trash text-14' }),
          }
        ),
      ]
    },
  },
]
</script>
