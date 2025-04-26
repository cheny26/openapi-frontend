<template>
  <div class="points-container">
    <!-- 积分概览卡片 -->
    <a-card class="points-overview-card" :bordered="false">
      <a-row :gutter="16">
        <a-col :span="8">
          <div class="points-balance">
            <div class="balance-title">当前积分余额</div>
            <div class="balance-value">{{ userPoints }}</div>
            <a-button type="primary" size="large" @click="showRechargeModal">充值积分</a-button>
          </div>
        </a-col>
        <a-col :span="16">
          <div class="points-stats">
            <a-row :gutter="16">
              <a-col :span="12">
                <a-statistic title="本月消费" :value="monthlyConsumption" />
              </a-col>
              <a-col :span="12">
                <a-statistic title="今日消费" :value="dailyConsumption" />
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>
    </a-card>


    <!-- 积分明细筛选器 -->
    <a-card title="积分明细" :bordered="false" class="points-detail-card">
      <a-form layout="inline" class="filter-form">
        <a-form-item label="日期范围">
          <a-range-picker v-model:value="dateRange" />
        </a-form-item>
        <a-form-item label="操作类型">
          <a-select
            v-model:value="operationType"
            placeholder="选择操作类型"
            style="width: 150px"
            :options="operationOptions"
            allow-clear
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="searchRecords">查询</a-button>
          <a-button style="margin-left: 8px" @click="resetFilters">重置</a-button>
        </a-form-item>
      </a-form>

      <!-- 积分明细表格 -->
      <a-table
        :columns="columns"
        :data-source="pointsRecords"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'interfaceName'">
            {{ record.interfaceName||''}}
          </template>
          <template v-if="column.key === 'createTime'">
            {{ new Date(record.createTime).toLocaleString()}}
          </template>
          <template v-if="column.key === 'pointsChange'">
            <span :style="{ color: record.pointsChange > 0 ? '#52c41a' : '#f5222d' }">
              {{ record.pointsChange > 0 ? '+' : '' }}{{ record.pointsChange }}
            </span>
          </template>
          <template v-if="column.key === 'transactionType'">
            <a-tag :color="getOperationTypeColor(record.transactionType)">
              {{ getOperationTypeText(record.transactionType) }}
            </a-tag>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted} from 'vue'
import { message } from 'ant-design-vue'
import { useLoginUserStore } from '@/stores/user'
import { fetchPointsStatisticsUsingGet, listPointTransactionByPageUsingPost } from '@/api/pointTransactionController'

const {loginUser}=useLoginUserStore()
// 用户积分数据
const userPoints = ref(loginUser.points)
const monthlyConsumption = ref(0)
const dailyConsumption = ref(0)


// 筛选条件
const dateRange = ref<[Date, Date] | null>(null)
const operationType = ref<string | null>(null)

// 表格相关
const loading = ref(false)
const pointsRecords = ref<API.PointTransaction[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条记录`
})

// 操作类型选项
const operationOptions = ref([
  { value: 'INTERFACE_CALL', label: 'API调用' },
  { value: 'SYSTEM_SIGN', label: '系统签到' }
])
const getOperationTypeText = (value: string) => {
  const option = operationOptions.value.find(option => option.value === value)
  return option ? option.label : '未知'
}

// 表格列定义
const columns = [
  {
    title: 'API接口名称',
    dataIndex: 'interfaceName',
    key: 'interfaceName',
  },
  {
    title: '积分变动',
    dataIndex: 'pointsChange',
    key: 'pointsChange',
  },
  {
    title: '操作类型',
    dataIndex: 'transactionType',
    key: 'transactionType',
    filters: operationOptions.value.map(option => ({ text: option.label, value: option.value }))
  },
  {
    title: '时间',
    dataIndex: 'createTime',
    key: 'createTime',
    sorter: true
  },
  {
    title: '备注',
    dataIndex: 'description',
    key: 'description',
    sorter: true
  }
]

// 获取操作类型的颜色
const getOperationTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    'API调用': 'blue',
    '调用奖励': 'green',
    '系统签到': 'purple'
  }
  return colorMap[type] || 'default'
}


// 获取积分记录
const fetchPointsRecords = async () => {
  loading.value = true
  try {
    const res=await listPointTransactionByPageUsingPost({
      userId:loginUser.id,
      current: pagination.current,
      pageSize: pagination.pageSize,
      transactionType: operationType.value??undefined,
      startTime: dateRange.value?.[0]?.$d??undefined,
      endTime: dateRange.value?.[1]?.$d??undefined,
    })
    if(res.data.code!==0){
      message.error(res.data.message)
      return
    }
    pointsRecords.value = res.data.data?.records??[]
    pagination.total = Number(res.data.data?.total)??0
  } catch (error) {
    message.error('获取积分记录失败')
    loading.value = false
  }finally {
    loading.value = false
  }
}

// 表格变化处理
const handleTableChange = (pag: any, filters: any, sorter: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize

  // 这里应该根据筛选和排序条件重新获取数据
  fetchPointsRecords()
}

// 搜索记录
const searchRecords = () => {
  pagination.current = 1
  fetchPointsRecords()
}
const fetchPointsStatistics=async()=>{
 const res=await fetchPointsStatisticsUsingGet();
 if(res.data.code!==0){
  message.error(res.data.message)
  return
 }
 const data=res.data.data
 dailyConsumption.value=-(data?.dailyConsumption??0)
 monthlyConsumption.value=-(data?.monthlyConsumption??0)
}
// 重置筛选条件
const resetFilters = () => {
  dateRange.value = null
  operationType.value = null
  pagination.current = 1
  fetchPointsRecords()
}

// 显示充值弹窗
const showRechargeModal = () => {
  message.warning('充值功能暂未开放')
}



// 组件挂载时初始化
onMounted(() => {
  fetchPointsRecords()
  fetchPointsStatistics()
})

</script>

<style scoped>
.points-container {
  padding: 24px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 64px);
}

.points-overview-card,
.chart-card,
.points-detail-card {
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.points-balance {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}

.balance-title {
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
}

.balance-value {
  font-size: 36px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 16px;
}

.points-stats {
  padding: 20px 0;
}

.filter-form {
  margin-bottom: 24px;
}

:deep(.ant-form-item) {
  margin-bottom: 16px;
}
</style>
