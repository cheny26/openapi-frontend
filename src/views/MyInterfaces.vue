<template>
  <div class="my-interfaces-container">
    <div class="list-header">
      <h1 class="page-title">我的接口</h1>
      <div class="header-actions">
        <a-input-search
          v-model:value="searchKeyword"
          placeholder="搜索接口名称或描述"
          style="width: 250px"
          @search="handleSearch"
        />
        <a-button type="primary" @click="handleAddInterface">
          <template #icon><plus-outlined /></template>
          创建接口
        </a-button>
      </div>
    </div>

    <a-spin :spinning="loading">
      <!-- 卡片列表 -->
      <div class="card-list">
        <a-empty v-if="interfaces.length === 0" description="暂无接口数据" />
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in interfaces" :key="item.id">
            <a-card hoverable class="api-card">
              <template #title>
                <div class="card-title">{{ item.name }}</div>
              </template>
              <template #extra>
                <a-dropdown>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item key="1" @click="handleViewDetail(item.id)">
                        <eye-outlined /> 查看
                      </a-menu-item>
                      <a-menu-item key="2" @click="handleEdit(item.id)">
                        <edit-outlined /> 编辑
                      </a-menu-item>
                      <a-menu-item key="3" @click="handleToggleStatus(item)">
                        <template v-if="item.status === 1">
                          <stop-outlined /> 下线
                        </template>
                        <template v-else>
                          <check-circle-outlined /> 上线
                        </template>
                      </a-menu-item>
                      <a-menu-item key="4" @click="handleDelete(item.id)">
                        <delete-outlined /> 删除
                      </a-menu-item>
                    </a-menu>
                  </template>
                  <a-button type="text">
                    <more-outlined />
                  </a-button>
                </a-dropdown>
              </template>
              <div class="card-description">{{ item.description || '暂无描述' }}</div>
              <div class="card-url">{{ item.url }}</div>
              <div class="card-footer">
                <div class="card-stats">
                  <div class="stat-item">
                    <a-tag :color="getMethodColor(item.method)">{{ item.method }}</a-tag>
                  </div>
                  <div class="stat-item">
                    <a-badge :status="item.status === 1 ? 'success' : 'error'" :text="item.status === 1 ? '已上线' : '已下线'" />
                  </div>
                </div>
                <div class="card-stats">
                  <div class="stat-item">
                    <thunderbolt-outlined />
                    <span>{{ item.totalNum || 0 }}次调用</span>
                  </div>
                  <div class="stat-item">
                    <crown-outlined />
                    <span>{{ item.points || 0 }}积分</span>
                  </div>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </div>

      <!-- 分页 -->
      <div class="pagination-container">
        <a-pagination
          v-model:current="current"
          v-model:pageSize="pageSize"
          :total="total"
          show-quick-jumper
          :show-total="(total) => `共 ${total} 条记录`"
          @change="handlePageChange"
        />
      </div>
    </a-spin>

    <!-- 确认删除对话框 -->
    <a-modal
      v-if="deleteModalVisible"
      title="确认删除"
      :confirm-loading="confirmLoading"
      @ok="confirmDelete"
      @cancel="cancelDelete"
    >
      <p>确定要删除该接口吗？删除后无法恢复。</p>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import {
  PlusOutlined,
  ThunderboltOutlined,
  CrownOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  StopOutlined,
  CheckCircleOutlined
} from '@ant-design/icons-vue';
import { deleteInterfacesUsingPost, listMyInterfacesVoByPageUsingGet, offlineInterfacesUsingPost, onlineInterfacesUsingPost } from '@/api/interfacesController';

const router = useRouter();
const loading = ref(false);
const interfaces = ref<API.InterfacesVO[]>([]);
const total = ref(0);
const current = ref(1);
const pageSize = ref(12);
const searchKeyword = ref('');
const deleteModalVisible = ref(false);
const confirmLoading = ref(false);
const interfaceToDelete = ref<number | null>(null);

const getMethodColor = (method: string) => {
  const colorMap: Record<string, string> = {
    GET: 'green',
    POST: 'blue',
    PUT: 'orange',
    DELETE: 'red',
  };
  return colorMap[method] || 'default';
};

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await listMyInterfacesVoByPageUsingGet({
      current: current.value,
      pageSize: pageSize.value,
      name: searchKeyword.value || undefined,
    });
    if (res.data && res.data.code === 0) {
      interfaces.value = res.data.data?.records || [];
      total.value = Number(res.data.data?.total) || 0;
    } else {
      message.error('获取接口列表失败');
    }
  } catch (error: any) {
    message.error('获取接口列表失败，' + error.message);
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (page: number, pageNum: number) => {
  current.value = page;
  pageSize.value = pageNum;
  fetchData();
};

const handleSearch = () => {
  current.value = 1;
  fetchData();
};

const handleViewDetail = (id: number) => {
  router.push(`/interfaces/detail/${id}`);
};

const handleEdit = (id: number) => {
  router.push(`/interfaces/edit/${id}`);
};

const handleAddInterface = () => {
  router.push('/interfaces/add');
};

const handleDelete = (id: number) => {
  interfaceToDelete.value = id;
  deleteModalVisible.value = true;
};

const confirmDelete = async () => {
  if (!interfaceToDelete.value) return;

  confirmLoading.value = true;
  try {
    const res = await deleteInterfacesUsingPost({ id: interfaceToDelete.value });
    if (res.data && res.data.code === 0) {
      message.success('删除成功');
      fetchData();
    } else {
      message.error(res.data?.message || '删除失败');
    }
  } catch (error: any) {
    message.error('删除失败，' + error.message);
  } finally {
    confirmLoading.value = false;
    deleteModalVisible.value = false;
    interfaceToDelete.value = null;
  }
};

const cancelDelete = () => {
  deleteModalVisible.value = false;
  interfaceToDelete.value = null;
};

const handleToggleStatus = async (item: API.InterfacesVO) => {
  if (!item.id) return;

  const newStatus = item.status === 1 ? 0 : 1;
  const statusText = newStatus === 1 ? '上线' : '下线';

  try {
    let res
    if(newStatus==1){
      res=await onlineInterfacesUsingPost({id:item.id})
    }else{
      res=await offlineInterfacesUsingPost({id:item.id})
    }
    if (res.data && res.data.code === 0) {
      message.success(`接口${statusText}成功`);
      // 更新本地状态
      item.status = newStatus;
    } else {
      message.error(res.data?.message || `接口${statusText}失败`);
    }
  } catch (error: any) {
    message.error(`接口${statusText}失败，` + error.message);
  }
};

onMounted(() => {
  fetchData();
});

// 监听搜索关键词变化，当清空时重新加载数据
watch(searchKeyword, (newVal, oldVal) => {
  if (oldVal && !newVal) {
    fetchData();
  }
});
</script>

<style scoped>
.my-interfaces-container {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #1f1f1f;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.card-list {
  margin-bottom: 24px;
}

.api-card {
  height: 100%;
  transition: all 0.3s;
}

.api-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-description {
  margin-bottom: 8px;
  color: #606266;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card-url {
  font-family: monospace;
  color: #909399;
  font-size: 12px;
  margin-bottom: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-footer {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
}

.card-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #909399;
  font-size: 12px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>
