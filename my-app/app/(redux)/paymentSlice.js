import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseURL from "../../assets/common/baseUrl";

// Initial state
const initialState = {
  clientSecret: null,
  isLoading: false,
  error: null,
};

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    paymentIntentRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    paymentIntentSuccess: (state, action) => {
      state.isLoading = false;
      state.clientSecret = action.payload;
    },
    paymentIntentFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setClientSecret: (state, action) => {
      state.clientSecret = action.payload;
    },
  },
});

// Actions
export const {
  paymentIntentRequest,
  paymentIntentSuccess,
  paymentIntentFailure,
  setClientSecret,
} = paymentSlice.actions;

// Async action for creating a subscription
export const createSubscription = createAsyncThunk(
  "payment/createSubscription",
  async ({ userId, promo }, { rejectWithValue }) => {
    try {
      // console.log(userId)

      const response = await axios.post(`${baseURL}/payments/create-stripe-subscription-transaction`, {
        userId, promo
      });
      const clientSecret = response.data.clientSecret;
      const stripeSubscriptionId = response.data.stripeSubscriptionId;
      // console.log(stripeSubscriptionId)
      // Store client secret in AsyncStorage
      await AsyncStorage.setItem("clientSecret", clientSecret);

      return { clientSecret, stripeSubscriptionId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error creating subscription");
    }
  }
);


// Async action to retrieve client secret from AsyncStorage
export const loadClientSecret = () => async (dispatch) => {
  try {
    const clientSecret = await AsyncStorage.getItem("clientSecret");
    if (clientSecret) {
      dispatch(setClientSecret(clientSecret));
    }
  } catch (error) {
    console.error("Error loading client secret from AsyncStorage:", error);
  }
};

export default paymentSlice.reducer;
