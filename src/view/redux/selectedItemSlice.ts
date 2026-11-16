import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {DateTime} from "luxon";
import SelectedItem from "../../entity/SelectedItem";
import {RootState} from "./store";

interface SelectedItemState {
    value: SelectedItem
}

const initialState : SelectedItemState = {
    value: new SelectedItem()
};

const selectedItemSlice = createSlice({
    name: 'selectedItem',
    initialState,
    reducers: {
        updateSelectedItem: (state, action: PayloadAction<SelectedItem>) => {
            state.value = action.payload;
        },
        updateSelectedDate: (state, action: PayloadAction<DateTime>) => {
            const newSelectedItem = new SelectedItem();
            newSelectedItem.type = state.value.type;
            newSelectedItem.date = action.payload;
            state.value = newSelectedItem;
        }
    }
});

export default selectedItemSlice;
export const {updateSelectedItem, updateSelectedDate} = selectedItemSlice.actions;
export const selectSelectedItem = (state: RootState) => state.selectedItem.value;