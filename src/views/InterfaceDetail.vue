<template>
  <div class="interface-detail-container">
    <a-page-header
      title="接口详情"
      @back="goBack"
    >
    </a-page-header>

    <a-spin :spinning="loading">
      <a-card v-if="interfaceDetail.id">
        <a-descriptions title="基本信息" bordered>
          <a-descriptions-item label="接口名称" span="3">{{ interfaceDetail.name }}</a-descriptions-item>
          <a-descriptions-item label="接口描述" span="3">{{ interfaceDetail.description }}</a-descriptions-item>
          <a-descriptions-item label="请求URL">{{ interfaceDetail.platformUrl }}</a-descriptions-item>
          <a-descriptions-item label="请求方式">
            <a-tag :color="getMethodColor(interfaceDetail.method??'')">{{ interfaceDetail.method }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="所需积分">{{ interfaceDetail.points }}</a-descriptions-item>
          <a-descriptions-item label="状态">
            <a-badge :status="interfaceDetail.status === 1 ? 'success' : 'error'" :text="interfaceDetail.status === 1 ? '开启' : '关闭'" />
          </a-descriptions-item>
          <a-descriptions-item label="调用次数">{{ interfaceDetail.totalNum }}</a-descriptions-item>
          <a-descriptions-item label="创建人">{{ interfaceDetail.userName }}</a-descriptions-item>
        </a-descriptions>

        <a-divider />

        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="请求参数">
            <a-table
              v-if="interfaceDetail.requestParameters && interfaceDetail.requestParameters.length > 0"
              :columns="requestParamsColumns"
              :data-source="interfaceDetail.requestParameters || []"
              :pagination="false"
              row-key="id"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'isRequired'">
                  <a-tag :color="record.isRequired==1 ? 'red' : 'green'">
                    {{ record.isRequired==1 ? '是' : '否' }}
                  </a-tag>
                </template>
              </template>
            </a-table>
            <a-empty v-else description="无请求参数" />
          </a-tab-pane>
          <a-tab-pane key="2" tab="返回参数">
            <a-table
              v-if="interfaceDetail.responseParameters && interfaceDetail.responseParameters.length > 0"
              :columns="responseParamsColumns"
              :data-source="interfaceDetail.responseParameters || []"
              :pagination="false"
              row-key="id"
            />
            <a-empty v-else description="暂无返回参数" />
          </a-tab-pane>
          <a-tab-pane key="3" tab="调用示例">
            <div v-if="interfaceDetail.interfaceExamples && (interfaceDetail.interfaceExamples.requestExample || interfaceDetail.interfaceExamples.responseExample)">
              <a-card title="请求示例" v-if="interfaceDetail.interfaceExamples.requestExample">
                <pre>{{ interfaceDetail.interfaceExamples.requestExample }}</pre>
              </a-card>
              <a-card title="返回示例" style="margin-top: 16px;" v-if="interfaceDetail.interfaceExamples.responseExample">
                <pre>{{ interfaceDetail.interfaceExamples.responseExample }}</pre>
              </a-card>
            </div>
            <a-empty v-else description="暂无返回参数" />
          </a-tab-pane>
        </a-tabs>

        <!-- 新增接口调用区域 -->
        <!-- <a-divider orientation="left">在线调用</a-divider> -->
        <h3>在线调用</h3>
        <div v-if="interfaceDetail.status === 1">
          <a-form
            :model="formState"
            @finish="onFinish"
            layout="vertical"
          >
            <a-card title="请求参数" v-if="interfaceDetail.requestParameters && interfaceDetail.requestParameters.length > 0">
              <div v-for="(param,index ) in interfaceDetail.requestParameters" :key="index">
                <a-form-item
                  :label="param.name"
                  :name="['params', param.name]"
                  :rules="[{ isRequired: param.isRequired, message: `请输入${param.name}` }]"
                >
                  <a-input
                    v-if="param.dataType !== 'object' && param.dataType !== 'array'"
                    :placeholder="`请输入${param.name} (${param.dataType})`"
                    v-model:value="formState.params[param.name]"
                  />
                  <a-textarea
                    v-else
                    :placeholder="`请输入${param.name} (${param.dataType}), 请使用JSON格式`"
                    v-model:value="formState.params[param.name]"
                    :rows="4"
                  />
                </a-form-item>
              </div>
            </a-card>

            <div style="margin-top: 16px; text-align: center;">
              <a-button type="primary" html-type="submit" :loading="invokeLoading">
                <template #icon><api-outlined /></template>
                调用接口
              </a-button>
            </div>
          </a-form>

          <a-card title="调用结果" style="margin-top: 16px;" v-if="invokeResult">
            <a-spin :spinning="invokeLoading">
              <pre>{{ formatJson(invokeResult) }}</pre>
            </a-spin>
          </a-card>
        </div>
        <a-empty v-else description="接口已关闭，无法调用" />
      </a-card>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import {  ApiOutlined } from '@ant-design/icons-vue';
import { getInterfacesVoByIdUsingGet, invokeInterfacesByIdUsingPost } from '@/api/interfacesController';

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const invokeLoading = ref(false);
const interfaceDetail = ref<API.InterfacesVO>({} as API.InterfacesVO);
const invokeResult = ref<unknown>(null);
const formState = reactive<{
  params: Record<string, unknown>;
}>({
  params: {}
});

const requestParamsColumns = [
  {
    title: '参数名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '参数类型',
    dataIndex: 'dataType',
    key: 'dataType',
  },
  {
    title: '是否必填',
    dataIndex: 'isRequired',
    key: 'isRequired',
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
  },
];

const responseParamsColumns = [
  {
    title: '参数名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '参数类型',
    dataIndex: 'dataType',
    key: 'dataType',
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
  },
];

const getMethodColor = (method: string) => {
  const colorMap: Record<string, string> = {
    GET: 'green',
    POST: 'blue',
    PUT: 'orange',
    DELETE: 'red',
  };
  return colorMap[method] || 'default';
};

const fetchInterfaceDetail = async (id: string) => {
  loading.value = true;
  try {
    const res = await getInterfacesVoByIdUsingGet({ id });
    if (res.data) {
      interfaceDetail.value = res.data.data??{};
    } else {
      message.error('获取接口详情失败');
    }
  } catch (error: any) {
    message.error('获取接口详情失败，' + error.message);
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.back();
};


// 格式化JSON显示
const formatJson = (jsonData: any) => {
  try {
    if (typeof jsonData === 'string') {
      return JSON.stringify(JSON.parse(jsonData), null, 2);
    }
    return JSON.stringify(jsonData, null, 2);
  } catch (e) {
    return jsonData;
  }
};

// 调用接口
const onFinish = async (values: any) => {
  if (!interfaceDetail.value.id) {
    message.error('接口不存在');
    return;
  }
  console.log(values);
  invokeLoading.value = true;
  try {
    // 处理参数，将JSON字符串转换为对象
    const params = { ...values.params };
    Object.keys(params).forEach(key => {
      const param = interfaceDetail.value.requestParameters?.find(p => p.name === key);
      if (param && (param.dataType === 'object' || param.dataType === 'array')) {
        try {
          params[key] = JSON.parse(params[key]);
        } catch (e) {
          // 如果解析失败，保持原样
        }
      }
    });

    const res = await invokeInterfacesByIdUsingPost({
      id: interfaceDetail.value.id,
      requestParameters:{...params}
    });

    invokeResult.value = res.data;
    message.success('调用成功');
  } catch (error: any) {
    message.error('调用失败，' + error.message);
  } finally {
    invokeLoading.value = false;
  }
};

onMounted(() => {
  const id = route.params.id as string;
  if (id) {
    fetchInterfaceDetail(id);
    // 重置表单状态
    formState.params = {};
  }
});
</script>

<style scoped>
.interface-detail-container {
  padding: 24px;
}

pre {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  overflow: auto;
}
</style>
