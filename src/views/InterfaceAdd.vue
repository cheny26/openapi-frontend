<template>
  <div class="interface-add-container">
    <a-page-header
      :title="isEdit ? '编辑接口' : '创建接口'"
      @back="goBack"
    />

    <a-card>
      <a-form
        :model="formState"
        :rules="rules"
        ref="formRef"
        layout="vertical"
        @finish="handleSubmit"
      >
      <h1>基本信息</h1>
        <a-form-item label="接口名称" name="name">
          <a-input v-model:value="formState.name" placeholder="请输入接口名称" />
        </a-form-item>

        <a-form-item label="接口描述" name="description">
          <a-textarea v-model:value="formState.description" placeholder="请输入接口描述" :rows="4" />
        </a-form-item>

        <a-form-item label="接口地址" name="url">
          <a-input v-model:value="formState.url" placeholder="请输入接口地址" />
        </a-form-item>

        <a-form-item label="请求方法" name="method">
          <a-select v-model:value="formState.method" placeholder="请选择请求方法">
            <a-select-option value="GET">GET</a-select-option>
            <a-select-option value="POST">POST</a-select-option>
            <a-select-option value="PUT">PUT</a-select-option>
            <a-select-option value="DELETE">DELETE</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="所需积分" name="points">
          <a-input-number v-model:value="formState.points" :min="0" style="width: 100%" />
        </a-form-item>

        <h1>请求参数</h1>
          <!-- 添加请求参数表头 -->
          <a-row :gutter="16" class="param-header">
          <a-col :span="4"><strong>参数名称</strong></a-col>
          <a-col :span="3"><strong>参数位置</strong></a-col>
          <a-col :span="3"><strong>参数类型</strong></a-col>
          <a-col :span="3"><strong>是否必填</strong></a-col>
          <a-col :span="9"><strong>参数描述</strong></a-col>
          <a-col :span="2"><strong>操作</strong></a-col>
        </a-row>

        <div v-for="(param, index) in formState.requestParameters" :key="index" class="param-item">
          <a-row :gutter="16">
            <a-col :span="4">
              <a-form-item
                :name="['requestParameters', index, 'name']"
                :rules="[{ required: true, message: '请输入参数名称' }]"
              >
                <a-input v-model:value="param.name" placeholder="参数名称" />
              </a-form-item>
            </a-col>
            <a-col :span="3">
              <a-form-item :name="['requestParameters', index, 'paramType']">
                <a-select v-model:value="param.paramType" placeholder="参数位置">
                  <a-select-option value="QUERY">QUERY</a-select-option>
                  <a-select-option value="BODY">BODY</a-select-option>
                  <!-- <a-select-option value="HEADER">HEADER</a-select-option>
                  <a-select-option value="PATH">PATH</a-select-option> -->
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="3">
              <a-form-item :name="['requestParameters', index, 'dataType']">
                <a-select v-model:value="param.dataType" placeholder="参数类型">
                  <a-select-option value="string">string</a-select-option>
                  <a-select-option value="number">number</a-select-option>
                  <a-select-option value="boolean">boolean</a-select-option>
                  <a-select-option value="object">object</a-select-option>
                  <a-select-option value="array">array</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="3">
              <a-form-item :name="['requestParameters', index, 'isRequired']">
                <a-select v-model:value="param.isRequired" placeholder="是否必填">
                  <a-select-option :value="1">是</a-select-option>
                  <a-select-option :value="0">否</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="9">
              <a-form-item :name="['requestParameters', index, 'description']">
                <a-input v-model:value="param.description" placeholder="参数描述" />
              </a-form-item>
            </a-col>
            <a-col :span="2">
              <a-button type="danger" @click="removeRequestParam(index)">
                <template #icon><delete-outlined /></template>
              </a-button>
            </a-col>
          </a-row>
        </div>

        <a-button type="dashed" block @click="addRequestParam" style="margin-bottom: 24px">
          <template #icon><plus-outlined /></template>
          添加请求参数
        </a-button>



        <h1>返回参数</h1>
        <!-- 添加返回参数表头 -->
        <a-row :gutter="16" class="param-header">
          <a-col :span="6"><strong>参数名称</strong></a-col>
          <a-col :span="5"><strong>参数类型</strong></a-col>
          <a-col :span="11"><strong>参数描述</strong></a-col>
          <a-col :span="2"><strong>操作</strong></a-col>
        </a-row>

        <div v-for="(param, index) in formState.responseParameters" :key="index" class="param-item">
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-item
                :name="['responseParameters', index, 'name']"
                :rules="[{ required: true, message: '请输入参数名称' }]"
              >
                <a-input v-model:value="param.name" placeholder="参数名称" />
              </a-form-item>
            </a-col>
            <a-col :span="5">
              <a-form-item :name="['responseParameters', index, 'dataType']">
                <a-select v-model:value="param.dataType" placeholder="参数类型">
                  <a-select-option value="string">string</a-select-option>
                  <a-select-option value="number">number</a-select-option>
                  <a-select-option value="boolean">boolean</a-select-option>
                  <a-select-option value="object">object</a-select-option>
                  <a-select-option value="array">array</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="11">
              <a-form-item :name="['responseParameters', index, 'description']">
                <a-input v-model:value="param.description" placeholder="参数描述" />
              </a-form-item>
            </a-col>
            <a-col :span="2">
              <a-button type="danger" @click="removeResponseParam(index)">
                <template #icon><delete-outlined /></template>
              </a-button>
            </a-col>
          </a-row>
        </div>

        <a-button type="dashed" block @click="addResponseParam" style="margin-bottom: 24px">
          <template #icon><plus-outlined /></template>
          添加返回参数
        </a-button>

        <h1>调用示例</h1>

        <a-form-item label="请求示例">
          <a-textarea v-model:value="requestExample" placeholder="请输入请求示例" :rows="6" />
        </a-form-item>

        <a-form-item label="返回示例" >
          <a-textarea v-model:value="responseExample" placeholder="请输入返回示例" :rows="6" />
        </a-form-item>

        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit" :loading="submitting">
              {{ isEdit ? '保存修改' : '创建接口' }}
            </a-button>
            <a-button @click="resetForm">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { addInterfacesUsingPost, getInterfacesVoByIdUsingGet, updateInterfacesUsingPost } from '@/api/interfacesController';

const router = useRouter();
const route = useRoute();
const formRef = ref();
const submitting = ref(false);
const isEdit = ref(false);
const interfaceId = ref<number | null>(null);

// 表单数据
const formState = ref<API.InterfacesAddRequest>({
  name: '',
  description: '',
  url: '',
  method: 'GET',
  points: 0,
  requestParameters: [],
  responseParameters: [],
});
const requestExample = ref('')
const responseExample = ref('')

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入接口名称' }],
  url: [{ required: true, message: '请输入接口地址' }],
  description: [{ required: true, message: '请输入接口描述' }],
  method: [{ required: true, message: '请选择请求方法' }],
  points: [{ required: true, message: '请输入所需积分' }],
};

// 添加请求参数
const addRequestParam = () => {
  formState.value.requestParameters?.push({
    name: '',
    dataType: 'string',
    isRequired: 0,
    description: '',
    paramType: 'QUERY', // 默认为QUERY类型
  });
};

// 移除请求参数
const removeRequestParam = (index: number) => {
  formState.value.requestParameters?.splice(index, 1);
};

// 添加返回参数
const addResponseParam = () => {
  formState.value.responseParameters?.push({
    name: '',
    dataType: 'string',
    description: '',
  });
};

// 移除返回参数
const removeResponseParam = (index: number) => {
  formState.value.responseParameters?.splice(index, 1);
};

// 获取接口详情
const fetchInterfaceDetail = async (id: number) => {
  try {
    const res = await getInterfacesVoByIdUsingGet({ id });
    if (res.data && res.data.code === 0 && res.data.data) {
      const interfaceData = res.data.data;

      // 填充表单数据
      formState.value.name = interfaceData.name || '';
      formState.value.description = interfaceData.description || '';
      formState.value.url = interfaceData.platformUrl || '';
      formState.value.method = interfaceData.method || 'GET';
      formState.value.points = interfaceData.points || 0;

      // 填充请求参数
      if (interfaceData.requestParameters && interfaceData.requestParameters.length > 0) {
        formState.value.requestParameters = interfaceData.requestParameters;
      }

      // 填充返回参数
      if (interfaceData.responseParameters && interfaceData.responseParameters.length > 0) {
        formState.value.responseParameters = interfaceData.responseParameters;
      }

      // 填充示例
      if (interfaceData.interfaceExamples) {
        requestExample.value = interfaceData.interfaceExamples.requestExample || '';
        responseExample.value = interfaceData.interfaceExamples.responseExample || '';
      }
    } else {
      message.error('获取接口详情失败');
      router.push('/');
    }
  } catch (error) {
    console.error('获取接口详情失败:', error);
    message.error('获取接口详情失败: ' + (error.message || '未知错误'));
    router.push('/');
  }
};

// 提交表单
const handleSubmit = async (values) => {
  submitting.value = true;
  try {

    // 添加接口示例到请求数据
    const requestData = {
      ...values,
      interfaceExamplesVO: (requestExample.value !== '' && responseExample.value !== '') ? {
        requestExample: requestExample.value,
        responseExample: responseExample.value
      } : undefined
    };

    // 如果是编辑模式，需要添加id
    if (isEdit.value && interfaceId.value) {
      requestData.id = interfaceId.value;
    }

    console.log(requestData);

    // 根据模式调用不同的API
    const res = isEdit.value
      ? await updateInterfacesUsingPost(requestData)
      : await addInterfacesUsingPost(requestData);

    if (res.data && res.data.code === 0) {
      message.success(isEdit.value ? '更新接口成功' : '创建接口成功');
      router.push('/');
    } else {
      message.error(res.data?.message || (isEdit.value ? '更新接口失败' : '创建接口失败'));
    }
  } catch (error) {
    console.error(isEdit.value ? '更新接口失败:' : '创建接口失败:', error);
    message.error((isEdit.value ? '更新接口失败: ' : '创建接口失败: ') + (error.message || '未知错误'));
  } finally {
    submitting.value = false;
  }
};

// 重置表单
const resetForm = () => {
  formRef.value.resetFields();
  formState.value.requestParameters = [];
  formState.value.responseParameters = [];
  requestExample.value = '';
  responseExample.value = '';

  // 如果是编辑模式，重新获取原始数据
  if (isEdit.value && interfaceId.value) {
    fetchInterfaceDetail(interfaceId.value);
  }
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 组件挂载时检查是否为编辑模式
onMounted(() => {
  // 从路由参数中获取接口ID
  const id = route.params.id;
  if (id && !isNaN(Number(id))) {
    isEdit.value = true;
    interfaceId.value = Number(id);
    fetchInterfaceDetail(interfaceId.value);
  }
});
</script>

<style scoped>
.interface-add-container {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.param-item {
  margin-bottom: 8px;
  padding: 16px;
  background-color: #fafafa;
  border-radius: 4px;
}

/* 添加表头样式 */
.param-header {
  margin-bottom: 8px;
  padding: 8px 16px;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-weight: 500;
  color: #333;
}
</style>
