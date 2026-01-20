import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
const { updateJournal } = await import(
  "@/lib/api/clientactions/journal-actions"
);
import { Journal, JournalState } from "@/lib/interfaces";

const initialState: JournalState = {
  current: null,
  loading: false,
  error: null,
};

export const updateJournalThunk = createAsyncThunk(
  "journal/update",
  async ({
    journal_id,
    formData,
  }: {
    journal_id: number;
    formData: FormData;
  }) => {
    const updatedJournal = await updateJournal(journal_id, formData);
    return updatedJournal;
  },
);

const journalSlice = createSlice({
  name: "journal",
  initialState,
  reducers: {
    initializeJournal: (state, action: PayloadAction<{ journal: Journal }>) => {
      state.current = action.payload.journal;
    },
    setJournal: (state, action: PayloadAction<Journal>) => {
      state.current = action.payload;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateJournalThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateJournalThunk.fulfilled,
        (state, action: PayloadAction<Journal>) => {
          state.loading = false;
          state.current = action.payload;
        },
      )
      .addCase(updateJournalThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update journal";
      });
  },
});

export const { initializeJournal, setJournal, clearError } =
  journalSlice.actions;
export default journalSlice.reducer;
