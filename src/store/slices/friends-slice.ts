import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { FriendRequest, FriendsState, MiniUser, User } from "@/lib/interfaces";
import {
  deleteFriendRequest,
  acceptFriendRequest,
  createFriendRequest,
} from "@/lib/api/clientactions/friend-actions";

const initialState: FriendsState = {
  accepted_requests: [],
  received_requests: [],
  sent_requests: [],
  discover_friends: [],
  loading: {
    deleting: [],
    accepting: [],
    sending: [],
  },
  error: null,
};

export const deleteFriendRequestThunk = createAsyncThunk(
  "friends/deleteFriendRequest",
  async (
    {
      request_id,
      type,
      curr_user_id,
    }: { request_id: number; type: string; curr_user_id: number },
    { rejectWithValue },
  ) => {
    try {
      await deleteFriendRequest(request_id);
      return { request_id, type, curr_user_id };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to delete friend request",
      );
    }
  },
);

export const acceptFriendRequestThunk = createAsyncThunk(
  "friends/acceptFriendRequest",
  async (request_id: number, { rejectWithValue }) => {
    try {
      await acceptFriendRequest(request_id);
      return request_id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to accept friend request",
      );
    }
  },
);

export const sendFriendRequestThunk = createAsyncThunk(
  "friends/sendFriendRequest",
  async ({ user_id }: { user_id: number }, { rejectWithValue }) => {
    try {
      const response = await createFriendRequest(user_id);
      return { user_id, created_request: response };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to send friend request",
      );
    }
  },
);

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    initializeFriendsData: (
      state,
      action: PayloadAction<{
        accepted_requests: FriendRequest[];
        received_requests: FriendRequest[];
        sent_requests: FriendRequest[];
        discover_friends: User[] | MiniUser[];
      }>,
    ) => {
      state.accepted_requests = action.payload.accepted_requests;
      state.received_requests = action.payload.received_requests;
      state.sent_requests = action.payload.sent_requests;
      state.discover_friends = action.payload.discover_friends;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // delete friend request
    builder
      .addCase(deleteFriendRequestThunk.pending, (state, action) => {
        const { request_id } = action.meta.arg;
        state.loading.deleting.push(request_id);
        state.error = null;
      })
      .addCase(deleteFriendRequestThunk.fulfilled, (state, action) => {
        const { request_id, type, curr_user_id } = action.payload;

        state.loading.deleting = state.loading.deleting.filter(
          (id) => id !== request_id,
        );

        let removedRequest: FriendRequest | undefined;

        switch (type) {
          case "my":
            const myRequestIndex = state.accepted_requests.findIndex(
              (req) => req.id === request_id,
            );
            if (myRequestIndex !== -1) {
              removedRequest = state.accepted_requests[myRequestIndex];
              state.accepted_requests.splice(myRequestIndex, 1);
            }
            break;
          case "received":
            const receivedRequestIndex = state.received_requests.findIndex(
              (req) => req.id === request_id,
            );
            if (receivedRequestIndex !== -1) {
              removedRequest = state.received_requests[receivedRequestIndex];
              state.received_requests.splice(receivedRequestIndex, 1);
            }
            break;
          case "sent":
            const sentRequestIndex = state.sent_requests.findIndex(
              (req) => req.id === request_id,
            );
            if (sentRequestIndex !== -1) {
              removedRequest = state.sent_requests[sentRequestIndex];
              state.sent_requests.splice(sentRequestIndex, 1);
            }
            break;
        }

        // add the other user back to discover friends list
        if (removedRequest) {
          const other_user =
            removedRequest.request_from.id === curr_user_id
              ? removedRequest.request_to
              : removedRequest.request_from;

          const userExists = state.discover_friends.some(
            (user) => user.id === other_user.id,
          );
          if (!userExists) {
            state.discover_friends.push(other_user);
          }
        }
      })
      .addCase(deleteFriendRequestThunk.rejected, (state, action) => {
        const { request_id } = action.meta.arg;
        state.loading.deleting = state.loading.deleting.filter(
          (id) => id !== request_id,
        );
        state.error = action.payload as string;
      });

    // accept friend request
    builder
      .addCase(acceptFriendRequestThunk.pending, (state, action) => {
        const request_id = action.meta.arg;
        state.loading.accepting.push(request_id);
        state.error = null;
      })
      .addCase(acceptFriendRequestThunk.fulfilled, (state, action) => {
        const request_id = action.payload;

        state.loading.accepting = state.loading.accepting.filter(
          (id) => id !== request_id,
        );

        const requestIndex = state.received_requests.findIndex(
          (req) => req.id === request_id,
        );

        if (requestIndex !== -1) {
          const acceptedRequest = state.received_requests[requestIndex];
          // move from received to accepted
          state.accepted_requests.push(acceptedRequest);
          state.received_requests.splice(requestIndex, 1);
        }
      })
      .addCase(acceptFriendRequestThunk.rejected, (state, action) => {
        const request_id = action.meta.arg;
        state.loading.accepting = state.loading.accepting.filter(
          (id) => id !== request_id,
        );
        state.error = action.payload as string;
      });

    // send friend request
    builder
      .addCase(sendFriendRequestThunk.pending, (state, action) => {
        const { user_id } = action.meta.arg;
        state.loading.sending.push(user_id);
        state.error = null;
      })
      .addCase(sendFriendRequestThunk.fulfilled, (state, action) => {
        console.log("send request fulfilled");
        const { user_id, created_request } = action.payload;

        state.loading.sending = state.loading.sending.filter(
          (id) => id !== user_id,
        );

        const user_index = state.discover_friends.findIndex(
          (user) => user.id === user_id,
        );
        console.log("user index: ", user_index);
        if (user_index !== -1) {
          // add to sent requests & remove from discover friends
          state.sent_requests.push(created_request);
          state.discover_friends.splice(user_index, 1);
          // console.log("created_request", created_request);
        }
      })
      .addCase(sendFriendRequestThunk.rejected, (state, action) => {
        const { user_id } = action.meta.arg;
        state.loading.sending = state.loading.sending.filter(
          (id) => id !== user_id,
        );
        state.error = action.payload as string;
      });
  },
});

export const { initializeFriendsData, clearError } = friendsSlice.actions;

export default friendsSlice.reducer;
