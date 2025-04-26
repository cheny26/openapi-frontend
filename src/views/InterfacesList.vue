<template>
    <div class="interface-list-container">
      <div class="list-header">
        <h1 class="page-title">API接口市场</h1>
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
              <a-card
                hoverable
                class="api-card"
                @click="handleViewDetail(item.id as number)"
              >
                <a-card-meta :title="item.name">
                  <template #description>
                    <div class="card-description">{{ item.description || '暂无描述' }}</div>
                    <div class="card-url">{{ item.platformUrl }}</div>
                    <div class="card-footer">
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
                  </template>
                </a-card-meta>
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
            :show-total="(total: any) => `共 ${total} 条记录`"
            @change="handlePageChange"
          />
        </div>
      </a-spin>
    </div>
  </template>

  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { message } from 'ant-design-vue';
  import {
    PlusOutlined,
    ThunderboltOutlined,
    CrownOutlined
  } from '@ant-design/icons-vue';
  import { listInterfacesVoByPageUsingGet } from '@/api/interfacesController';

  const router = useRouter();
  const loading = ref(false);
  const interfaces = ref<API.InterfacesVO[]>([]);
  const total = ref(0);
  const current = ref(1);
  const pageSize = ref(12);
  const searchKeyword = ref('');


  const fetchData = async () => {
    loading.value = true;
    try {
      const res = await listInterfacesVoByPageUsingGet({
        current: current.value,
        pageSize: pageSize.value,
        description: searchKeyword.value || undefined,
      });
      if (res.data) {
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

  const handleAddInterface = () => {
    router.push('/interfaces/add');
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
  .interface-list-container {
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

  .filter-container {
    background: white;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 24px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .filter-item {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
  }

  .filter-item:last-child {
    margin-bottom: 0;
  }

  .filter-label {
    width: 80px;
    color: #606266;
  }

  .card-list {
    margin-bottom: 24px;
  }

  .api-card {
    height: 100%;
    transition: all 0.3s;
    overflow: hidden;
  }

  .api-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
    border-top: 1px solid #f0f0f0;
    padding-top: 12px;
  }

  .card-stats {
    display: flex;
    gap: 12px;
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
