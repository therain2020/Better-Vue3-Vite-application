<script setup>
import {
  deleteBorrowBatchService,
  deleteByIdService,
  getBorrowByReaderIdService,
  returnBookService
} from "@/methods/borrow.js";
import {onMounted, ref} from "vue";
import HeaderView from "@/components/HeaderView.vue";
import SideView from "@/components/SideView.vue";
import {ElMessage} from "element-plus";
import {Delete} from "@element-plus/icons-vue";

const tableData = ref([]);

onMounted(() => {
  // console.log(new Date().toISOString().split('T')[0]);
  getBorrowByReaderId();
})

// 归还
const returnBook = async (id, isbn) => {
  await returnBookService(id, isbn);
  ElMessage.success('归还成功！');
  await getBorrowByReaderId();
}

// 表格行背景颜色样式类
const tableRowClassName = ({row}) => {
  const current = new Date().toISOString().split('T')[0]
  if (row.status) {
    if (row.returnDate <= row.dueDate) {
      return 'success-row';
    }
    return 'danger-row'
  } else {
    if (current > row.dueDate) {
      return 'danger-row'
    }
    return 'warning-row';
  }
}

//获取当前读者的借阅信息，并根据状态筛选
const getBorrowByReaderId = async function () {
  const result = await getBorrowByReaderIdService();
  tableData.value = result.data;
  if (filterStatus.value === 'returned') {
    tableData.value = result.data.filter(item => item.status === true);
  } else if (filterStatus.value === 'notReturned') {
    tableData.value = result.data.filter(item => item.status === false);
  }
}

// 刷新状态
const flushStatus = async function (status) {
  // console.log(status);
  filterStatus.value = status;
  await getBorrowByReaderId();
}
const filterStatus = ref('all'); // 'all', 'returned', 'notReturned'


// 根据id删除借阅记录
const deleteById = async function (id) {
  await deleteByIdService(id);
  ElMessage.success('删除成功！');
  //刷新表格
  await getBorrowByReaderId();
}

// 全部选中的记录的id
let ids = ref([]);
const handleSelectionChange = (val) => {
  ids.value = val.map(item => item.id);
}

const deleteBorrowBatch = async () => {
  if (ids.value.length === 0) {
    ElMessage.warning('请先选择要删除的记录！');
    return;
  }
  await deleteBorrowBatchService(ids.value);
  ElMessage.success('批量删除成功！');
  await getBorrowByReaderId();
}

</script>
<template>
    <div>
        <el-container>
            <el-aside width="200px" class="aside-container">
                <side-view/>
            </el-aside>
            <el-container>
                <el-header>
                    <header-view/>
                </el-header>
                <el-main>
                    <div class="toolbar-container">
                        <el-button-group class="filter-group">
                            <el-button
                                    @click="flushStatus('all')"
                                    :type="filterStatus === 'all' ? 'primary' : ''">
                                全部
                            </el-button>
                            <el-button
                                    @click="flushStatus('returned')"
                                    :type="filterStatus === 'returned' ? 'primary' : ''"
                                    class="success-btn">
                                已归还
                            </el-button>
                            <el-button
                                    @click="flushStatus('notReturned')"
                                    :type="filterStatus === 'notReturned' ? 'primary' : ''"
                                    class="danger-btn">
                                未归还
                            </el-button>
                        </el-button-group>
                        <el-button
                                @click="deleteBorrowBatch"
                                type="danger"
                                :icon="Delete"
                                class="batch-delete-btn"/>
                    </div>

                    <el-row>
                        <el-col :span="24">
                            <el-table
                                    ref="table"
                                    :data="tableData"
                                    style="width: 100%"
                                    height="calc(100vh - 180px)"
                                    :row-class-name="tableRowClassName"
                                    @selection-change="handleSelectionChange"
                                    stripe
                                    border>
                                <el-table-column
                                        v-if="filterStatus==='returned'"
                                        type="selection"
                                        width="55"
                                        align="center"/>

                                <el-table-column
                                        sortable
                                        prop="bookName"
                                        label="书名"
                                        width="180"
                                        header-align="center"/>
                                <el-table-column
                                        sortable
                                        prop="borrowDate"
                                        label="借阅日期"
                                        width="150"
                                        align="center"/>
                                <el-table-column
                                        sortable
                                        prop="dueDate"
                                        label="应还日期"
                                        width="150"
                                        align="center"/>
                                <el-table-column
                                        sortable
                                        prop="returnDate"
                                        label="归还日期"
                                        width="150"
                                        align="center"/>

                                <el-table-column
                                        prop="status"
                                        label="状态"
                                        width="120"
                                        align="center">
                                    <template #default="scope">
                                        <el-tag
                                                :size="scope.row.status  ? 'small' : 'small'"
                                                :type="scope.row.status  ? 'success' : 'danger'"
                                                effect="dark">
                                            {{ scope.row.status  ? '已归还' : '未归还' }}
                                        </el-tag>
                                    </template>
                                </el-table-column>

                                <el-table-column
                                        label="操作"
                                        width="200"
                                        align="center">
                                    <template #default="scope">
                                        <el-button
                                                @click="returnBook(scope.row.id,scope.row.isbn)"
                                                type="text"
                                                size="small"
                                                :disabled="scope.row.status"
                                                class="action-btn">
                                            <span class="btn-text">归还</span>
                                        </el-button>
                                        <el-button
                                                @click="deleteById(scope.row.id)"
                                                type="text"
                                                size="small"
                                                :disabled="!scope.row.status"
                                                class="action-btn danger-action">
                                            <span class="btn-text">删除记录</span>
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<style scoped>
    .aside-container {
        height: 100vh;
        background: #ffffff;
        box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
    }
    
    .toolbar-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding: 0 15px;
    }

    .filter-group {
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        border-radius: 8px;
    }

    .batch-delete-btn {
        box-shadow: 0 2px 8px rgba(255,0,0,0.15);
        border-radius: 8px;
        padding: 10px 15px;
    }

    .el-table {
        --el-table-border-color: #e8e8e8;
        --el-table-header-bg-color: #f8f9fa;
        --el-table-row-hover-bg-color: #f5f7fa;
        font-size: 14px;
    }

    .el-table :deep(.cell) {
        line-height: 1.6;
    }

    .action-btn {
        margin: 0 8px;
        transition: all 0.2s;
    }

    .action-btn:hover .btn-text {
        border-bottom: 1px solid currentColor;
    }

    .danger-action:hover {
        color: var(--el-color-danger);
    }

    .el-tag {
        font-weight: 500;
        letter-spacing: 0.5px;
    }

    /* 优化状态行颜色 */
    :deep(.el-table .danger-row) {
        --el-table-tr-bg-color: rgba(255, 87, 87, 0.12);
        --el-table-tr-hover-bg-color: rgba(255, 87, 87, 0.18);
    }

    :deep(.el-table .warning-row) {
        --el-table-tr-bg-color: rgba(255, 193, 7, 0.12);
        --el-table-tr-hover-bg-color: rgba(255, 193, 7, 0.18);
    }

    :deep(.el-table .success-row) {
        --el-table-tr-bg-color: rgba(76, 175, 80, 0.12);
        --el-table-tr-hover-bg-color: rgba(76, 175, 80, 0.18);
    }
</style>
