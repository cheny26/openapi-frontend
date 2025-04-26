<template>
  <div class="sign-calendar-container">
    <div>
      <!-- 签到卡片头部 -->
      <div class="sign-card-header">
        <div class="user-info">
          <div class="points-badge">
            <span class="points-value">{{ userPoints }}</span>
            <span class="points-label">积分</span>
          </div>
          <div class="streak-info" @click="showRewardInfo">
            <div class="streak-count">{{ continuousDays }}<span class="day-text">天</span></div>
            <div class="streak-label">连续签到 <InfoCircleOutlined class="info-icon" /></div>
          </div>
        </div>
      </div>

      <!-- 日历部分 -->
      <div class="calendar-wrapper">
        <a-calendar
          v-model:value="value"
          :fullscreen="false"
          @panelChange="onPanelChange"
          @select="onSelect"
          class="compact-calendar"
        >
          <!-- 自定义日历头部 -->
          <template #headerRender="{ value: current }">
            <div class="custom-calendar-header">
              <div class="month-selector">
                <a-button type="text" class="month-nav-btn" @click="prevMonth">
                  <LeftOutlined />
                </a-button>
                <span class="calendar-header-title">{{ current.format('YYYY年MM月') }}</span>
                <a-button type="text" class="month-nav-btn" @click="nextMonth"
                  :disabled="isNextMonthDisabled">
                  <RightOutlined />
                </a-button>
              </div>
            </div>
          </template>

          <template #dateFullCellRender="{ current }">
            <div class="date-cell-wrapper">
              <div class="date-cell"
                :class="{
                  'signed': isDateSigned(current),
                  'future-date': isFutureDate(current),
                  'today': isCurrentDay(current),
                  'past-date': isPastDate(current) && !isDateSigned(current),
                  'selected': isSelectedDate(current),
                  'not-current-month': !isCurrentMonth(current)
                }">
                <span class="date-number">{{ getDayNumber(current) }}</span>
              </div>
            </div>
          </template>
        </a-calendar>
      </div>

      <!-- 签到按钮 -->
      <div class="sign-action-area">
        <a-button
          type="primary"
          class="sign-button"
          :disabled="!canSignToday"
          :loading="loading"
          @click="signInToday"
        >
          {{ getButtonText() }}
        </a-button>
      </div>
    </div>

    <!-- 连续签到奖励弹窗 -->
    <a-modal
      v-model:open="rewardModalVisible"
      title="连续签到奖励"
      :footer="null"
      :centered="true"
      :maskClosable="true"
      class="reward-modal"
    >
      <div class="reward-container">
        <div class="current-streak">
          <div class="streak-title">已连续签到</div>
          <div class="streak-days">{{ continuousDays }}<span class="streak-unit">天</span></div>
        </div>
        <div class="reward-list">
          <div class="reward-item" :class="{ 'reward-achieved': continuousDays >= 3 }">
            <div class="reward-day">3天</div>
            <div class="reward-progress">
              <div class="progress-bar" :style="{width: Math.min(continuousDays/3*100, 100) + '%'}"></div>
            </div>
            <div class="reward-points">+20积分</div>
          </div>
          <div class="reward-item" :class="{ 'reward-achieved': continuousDays >= 7 }">
            <div class="reward-day">7天</div>
            <div class="reward-progress">
              <div class="progress-bar" :style="{width: Math.min(continuousDays/7*100, 100) + '%'}"></div>
            </div>
            <div class="reward-points">+50积分</div>
          </div>
          <div class="reward-item" :class="{ 'reward-achieved': continuousDays >= 15 }">
            <div class="reward-day">15天</div>
            <div class="reward-progress">
              <div class="progress-bar" :style="{width: Math.min(continuousDays/15*100, 100) + '%'}"></div>
            </div>
            <div class="reward-points">+100积分</div>
          </div>
          <div class="reward-item" :class="{ 'reward-achieved': continuousDays >= 30 }">
            <div class="reward-day">30天</div>
            <div class="reward-progress">
              <div class="progress-bar" :style="{width: Math.min(continuousDays/30*100, 100) + '%'}"></div>
            </div>
            <div class="reward-points">+200积分</div>
          </div>
        </div>
        <div class="reward-tips">
          每日签到可获得5积分，连续签到还可获得额外奖励！
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed} from 'vue';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { message } from 'ant-design-vue';
import { LeftOutlined, RightOutlined, InfoCircleOutlined } from '@ant-design/icons-vue';
import { useLoginUserStore } from '@/stores/user';
import { getMonthSignInfoUsingGet, getUserPointsUsingGet, signUsingPost } from '@/api/signController';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

// 获取当前登录用户
const loginUserStore = useLoginUserStore();
const userId = computed(() => loginUserStore.loginUser.id);

// 修复any类型
const getDayNumber = (date: Dayjs): number => {
  return date.date();
};

// 日历数据
const value = ref<Dayjs>(dayjs());
const selectedDate = ref<Dayjs>(dayjs());
const signedDates = ref<boolean[]>([]);
const continuousDays = ref(0);
const userPoints = ref(0);
const todaySigned = ref(false);
const loading = ref(false);
const rewardModalVisible = ref(false);

// 显示奖励信息弹窗
const showRewardInfo = () => {
  rewardModalVisible.value = true;
};

// 判断是否是未来日期
const isFutureDate = (date: Dayjs): boolean => {
  return date.isAfter(dayjs(), 'day');
};

// 判断是否是过去日期
const isPastDate = (date: Dayjs): boolean => {
  return date.isBefore(dayjs(), 'day');
};

// 判断是否是今天
const isCurrentDay = (date: Dayjs): boolean => {
  return date.isSame(dayjs(), 'day');
};

// 判断是否是选中日期
const isSelectedDate = (date: Dayjs): boolean => {
  return selectedDate.value && date.isSame(selectedDate.value, 'day');
};

// 判断是否是当前月份
const isCurrentMonth = (date: Dayjs): boolean => {
  return date.month() === value.value.month();
};

// 判断是否可签到（只有今天且未签到才能签到）
const canSignToday = computed(() => {
  return isCurrentDay(selectedDate.value) && !todaySigned.value;
});

// 获取按钮文本
const getButtonText = (): string => {
  // 如果选中今天
  if (isCurrentDay(selectedDate.value)) {
    return todaySigned.value ? '今日已签到' : '签到';
  }

  // 如果选中的是未来日期
  if (isFutureDate(selectedDate.value)) {
    return '不可补签';
  }

  // 如果选中的是过去已签到的日期
  if (isPastDate(selectedDate.value) && isDateSigned(selectedDate.value)) {
    return '已签到';
  }

  // 如果选中的是过去未签到的日期
  return '不可补签';
};

// 是否禁用下个月按钮
const isNextMonthDisabled = computed(() => {
  const today = dayjs();
  const nextMonthDate = value.value.add(1, 'month');
  return nextMonthDate.isAfter(today, 'month');
});

// 当前年月
const currentYear = computed(() => value.value?.year());
const currentMonth = computed(() => value.value?.month() + 1); // dayjs月份从0开始

// 月份导航
const prevMonth = () => {
  value.value = value.value.subtract(1, 'month');
  fetchMonthSignInfo();
};

const nextMonth = () => {
  const today = dayjs();
  const nextMonthDate = value.value.add(1, 'month');

  // 不允许查看未来月份
  if (nextMonthDate.isAfter(today, 'month')) {
    return;
  }

  value.value = nextMonthDate;
  fetchMonthSignInfo();
};

// 面板变化事件
const onPanelChange = (val: Dayjs) => {
  value.value = val;
  fetchMonthSignInfo();
};

// 日期选择事件
const onSelect = (date: Dayjs) => {
  const today = dayjs();

  // 只能选择今天或之前的日期
  if (date.isAfter(today, 'day')) {
    return;
  }

  // 更新选中日期
  selectedDate.value = date;

  // 如果选择今天且未签到，则触发签到
  if (date.isSame(today, 'day') && !todaySigned.value) {
    signInToday();
  }
};

// 判断日期是否已签到
const isDateSigned = (date: Dayjs) => {
  // 如果是未来日期，不可签到
  if (date.isAfter(dayjs(), 'day')) {
    return false;
  }

  // 如果不是当前月份，不显示签到状态
  if (date.month() !== value.value?.month()) {
    return false;
  }

  // 根据后端返回的签到信息判断是否已签到
  return signedDates.value[date.date() - 1] === true;
};

// 签到功能
const signInToday = async () => {
  if (!userId.value) {
    message.warning('请先登录');
    return;
  }

  if (todaySigned.value) {
    message.info('今日已签到');
    return;
  }

  loading.value = true;
  try {
    const result = await signUsingPost({userId:userId.value});

    if (result.data.code === 0 && result.data.data) {
      message.success('签到成功');
      todaySigned.value = true;

      // 重新获取签到信息和积分
      await fetchMonthSignInfo();
      await fetchUserPoints();
    } else {
      message.error('签到失败：' + (result.data.message || '未知错误'));
    }
  } catch (error) {
    console.error('签到出错：', error);
    message.error('签到失败，请稍后再试');
  } finally {
    loading.value = false;
  }
};

// 获取当月签到信息
const fetchMonthSignInfo = async () => {
  if (!userId.value || !currentYear.value || !currentMonth.value) return;

  try {
    const result = await getMonthSignInfoUsingGet({userId:userId.value,year:currentYear.value,month:currentMonth.value});

    if (result.data.code === 0 && result.data.data) {
      signedDates.value = result.data.data.signInfo || [];
      continuousDays.value = result.data.data.continuousDays || 0;
      userPoints.value = result.data.data.points || 0;

      // 检查今日是否已签到
      const today = dayjs();
      if (today.year() === currentYear.value && today.month() + 1 === currentMonth.value) {
        todaySigned.value = signedDates.value[today.date() - 1] === true;
      }
    }
  } catch (error) {
    console.error('获取签到信息出错：', error);
  }
};

// 获取用户积分
const fetchUserPoints = async () => {
  if (!userId.value) return;

  try {
    const result = await getUserPointsUsingGet({userId:userId.value});

    if (result.data.code === 0) {
      userPoints.value = result.data.data || 0;
    }
  } catch (error) {
    console.error('获取用户积分出错：', error);
  }
};

onMounted(() => {
  // 初始化选中日期为今天
  selectedDate.value = dayjs();

  if (userId.value) {
    fetchMonthSignInfo();
    fetchUserPoints();
  }
});
</script>

<style scoped>
.sign-calendar-container {
  width: 600px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 签到卡片头部 */
.sign-card-header {
  background: #1890ff;
  padding: 16px;
  color: white;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.points-badge, .streak-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.streak-info {
  text-align: right;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 6px;
}

.streak-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.points-value, .streak-count {
  font-size: 24px;
  font-weight: bold;
}

.points-label, .streak-label, .day-text, .info-icon {
  font-size: 12px;
  opacity: 0.8;
}

.streak-count {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.day-text {
  margin-left: 4px;
  font-weight: normal;
}

.streak-label {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.info-icon {
  margin-left: 4px;
}

/* 日历部分 */
.calendar-wrapper {
  padding: 12px;
}

.month-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 0 8px;
}

.calendar-header-title {
  margin: 0 12px;
  font-weight: bold;
}

.month-nav-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.date-cell {
  height: 100%;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  min-height: 40px;
}

.date-number {
  font-size: 14px;
}

.signed {
  background: linear-gradient(to right, #52c41a, #389e0d);
  color: white;
  font-weight: bold;
}

.future-date {
  color: #ccc;
  background-color: #f7f7f7;
}

.today:not(.signed) {
  border: 2px solid #1890ff;
  color: #1890ff;
  font-weight: bold;
}

.past-date {
  color: #666;
}

.selected:not(.signed):not(.future-date) {
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
}

.not-current-month {
  background-color: #fafafa;
}

/* 签到按钮 */
.sign-action-area {
  padding: 12px 16px;
}

.sign-button {
  width: 100%;
  height: 40px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 6px;
  background: linear-gradient(to right, #1890ff, #096dd9);
  border: none;
}

/* 奖励弹窗样式 */
.reward-modal {
  width: 340px !important;
}

.current-streak {
  text-align: center;
  margin-bottom: 20px;
}

.streak-title {
  font-size: 16px;
  color: #666;
}

.streak-days {
  font-size: 36px;
  font-weight: bold;
  color: #1890ff;
}

.streak-unit {
  font-size: 18px;
  margin-left: 4px;
}

/* 连续签到奖励样式 */
.reward-container {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
}

.reward-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reward-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #f9f9f9;
  border-radius: 6px;
}

.reward-day {
  width: 32px;
  font-weight: bold;
  color: #666;
  font-size: 13px;
}

.reward-progress {
  flex: 1;
  height: 6px;
  background-color: #eee;
  border-radius: 3px;
  margin: 0 8px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(to right, #52c41a, #389e0d);
  border-radius: 3px;
}

.reward-points {
  font-weight: bold;
  color: #1890ff;
  width: 60px;
  text-align: right;
  font-size: 13px;
}

.reward-achieved {
  background-color: #f6ffed;
  border-left: 3px solid #52c41a;
}

.reward-achieved .reward-day {
  color: #1890ff;
}

.reward-achieved .reward-points {
  color: #52c41a;
}

.reward-tips {
  margin-top: 16px;
  text-align: center;
  color: #999;
  font-size: 13px;
}

/* Ant Design 样式覆盖 */
:deep(.compact-calendar .ant-picker-body) {
  padding: 8px 6px;
}

:deep(.compact-calendar .ant-picker-content) {
  height: auto !important;
  max-height: 250px;
}

:deep(.compact-calendar .ant-picker-cell) {
  height: auto !important;
  padding: 1px !important;
}

:deep(.ant-picker-calendar) {
  border-radius: 6px;
}

:deep(.ant-picker-calendar-date) {
  margin: 1px;
  border-radius: 6px;
}

:deep(.ant-picker-calendar-date-today) {
  border-color: transparent;
  background-color: transparent;
}

:deep(.ant-picker-cell-inner) {
  width: 100%;
  height: 100%;
}

:deep(.ant-picker-calendar-date-value) {
  display: none;
}

:deep(.ant-picker-content) th {
  padding: 6px 0;
  font-weight: bold;
  color: #1890ff;
  font-size: 12px;
}
</style>

