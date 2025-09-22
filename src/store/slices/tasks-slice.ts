import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Task, TasksState } from "@/lib/interfaces";
import { deleteTask } from "@/lib/api/clientactions/journal-actions";

const initialState: TasksState = {
  tasks: [],
  loading: {completing: []},
  error: null,
};

export const deleteTaskThunk= createAsyncThunk(
  "tasks/deleteTask",
  async ({ task_id }: { task_id: number },{ rejectWithValue }, ) => {
    try {
      await deleteTask(task_id);
      return task_id;

    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to delete task",
      );
    }
  },
);


const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    initializeTasksData: (state, action: PayloadAction<{tasks: Task[]}>,) => {
      state.tasks = action.payload.tasks;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteTaskThunk.pending, (state, action) => {
        const { task_id } = action.meta.arg;
        state.loading.completing.push(task_id);
        state.error = null;
      })
      .addCase(deleteTaskThunk.fulfilled, (state, action) => {
        state.error = null;
        const task_id  = action.payload;

        state.loading.completing = state.loading.completing.filter(
          (id) => id !== task_id,
        );

        const index = state.tasks.findIndex((task) => task.id === task_id);

        if (index > -1) {
            state.tasks.splice(index, 1);
        }
      })
      .addCase(deleteTaskThunk.rejected, (state, action) => {
        const { task_id } = action.meta.arg;
        state.loading.completing = state.loading.completing.filter(
          (id) => id !== task_id,
        );
        state.error = action.payload as string;
      });

  },
});

export const { initializeTasksData, clearError } = tasksSlice.actions;

export default tasksSlice.reducer;
