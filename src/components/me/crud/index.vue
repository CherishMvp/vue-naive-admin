<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/04 22:51:42
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <AppCard
    v-if="$slots.default"
    bordered
    bg="#fafafc dark:black"
    class="flex justify-between p-16 mb-30 min-h-60 rounded-4"
  >
    <n-space wrap :size="[32, 16]">
      <slot />
    </n-space>
    <div class="flex-shrink-0">
      <n-button ghost type="primary" @click="handleReset">
        <i class="mr-4 i-fe:rotate-ccw" />
        重置
      </n-button>
      <n-button class="ml-20" type="primary" @click="handleSearch">
        <i class="mr-4 i-fe:search" />
        搜索
      </n-button>
    </div>
  </AppCard>

  <n-data-table
    :remote="remote"
    :loading="loading"
    :scroll-x="scrollX"
    :columns="columns"
    :data="tableData"
    :row-key="(row) => row[rowKey]"
    :pagination="isPagination ? pagination : false"
    @update:checked-row-keys="onChecked"
    @update:page="onPageChange"
  />
</template>

<script setup>
import { NDataTable } from 'naive-ui'
import { utils, writeFile } from 'xlsx'

// 接受传来的参数，包括分页数据、列名和搜索组件的搜索参数等
const props = defineProps({
  /**
   * @remote true: 后端分页  false： 前端分页
   */
  remote: {
    type: Boolean,
    default: true,
  },
  /**
   * @remote 是否分页
   */
  isPagination: {
    type: Boolean,
    default: true,
  },
  scrollX: {
    type: Number,
    default: 1200,
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  columns: {
    type: Array,
    required: true,
  },
  /** queryBar中的参数 */
  queryItems: {
    type: Object,
    default() {
      return {}
    },
  },
  /**
   * ! 约定接口入参出参
   * * 分页模式需约定分页接口入参
   *    @pageSize 分页参数：一页展示多少条，默认10
   *    @pageNo   分页参数：页码，默认1
   * * 需约定接口出参
   *    @pageData 分页模式必须,非分页模式如果没有pageData则取上一层data
   *    @total    分页模式必须，非分页模式如果没有total则取上一层data.length
   */
  getData: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['update:queryItems', 'onChecked', 'onDataChange'])
const loading = ref(false)
const initQuery = { ...props.queryItems }
const tableData = ref([])
const pagination = reactive({ page: 1, pageSize: 10 })

// 处理搜索具体逻辑
async function handleQuery() {
  try {
    loading.value = true
    let paginationParams = {}
    // 如果非分页模式或者使用前端分页,则无需传分页参数isPagination=>是否分页 remote=>true表示后端分页
    if (props.isPagination && props.remote) {
      paginationParams = { pageNo: pagination.page, pageSize: pagination.pageSize }
    }
    const params = {
      ...props.queryItems,
      ...paginationParams,
    }
    for (let key in params) {
      if (params[key] === '') {
        delete params[key]
      }
    }
    console.log('params', params)
    const { data } = await props.getData({
      ...params,
    })
    tableData.value = data?.pageData || data
    console.log('tableData.value', tableData.value)
    pagination.itemCount = data.total ?? data.length
  } catch (error) {
    tableData.value = []
    pagination.itemCount = 0
  } finally {
    emit('onDataChange', tableData.value)
    loading.value = false
  }
}

// 搜索方法入口
function handleSearch() {
  console.log('搜索参数', props.queryItems)
  pagination.page = 1
  handleQuery()
}

//重置搜索参数等
async function handleReset() {
  const queryItems = { ...props.queryItems }
  for (const key in queryItems) {
    queryItems[key] = null
  }
  // 父组件对这个子组件使用的是v-model方法，所以可以直接使用下面这个emit事件 update:queryItems
  emit('update:queryItems', { ...queryItems, ...initQuery })
  await nextTick()
  pagination.page = 1
  handleQuery() //重置操作，会出现读取数据表
}

// 分页操作，手动设置page
function onPageChange(currentPage) {
  console.log('currentPage', currentPage)
  pagination.page = currentPage
  if (props.remote) {
    handleQuery()
  }
}
function onChecked(rowKeys) {
  console.log('rowKeys', rowKeys)
  if (props.columns.some((item) => item.type === 'selection')) {
    emit('onChecked', rowKeys)
  }
}
// 导出数据表
function handleExport(columns = props.columns, data = tableData.value) {
  if (!data?.length) return $message.warning('没有数据')
  const columnsData = columns.filter((item) => !!item.title && !item.hideInExcel)
  const thKeys = columnsData.map((item) => item.key)
  const thData = columnsData.map((item) => item.title)
  const trData = data.map((item) => thKeys.map((key) => item[key]))
  const sheet = utils.aoa_to_sheet([thData, ...trData])
  const workBook = utils.book_new()
  utils.book_append_sheet(workBook, sheet, '数据报表')
  writeFile(workBook, '数据报表.xlsx')
}

// 暴露的方法
defineExpose({
  handleSearch,
  handleReset,
  handleExport,
})
</script>
