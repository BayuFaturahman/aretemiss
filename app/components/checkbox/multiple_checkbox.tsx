import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Checkbox } from './checkbox';
import { Colors } from '@styles/index';

const CheckBoxComponent = ({ data, onError, onCheckedItemsChange, onTrigger }) => {
  const [checkedItems, setCheckedItems] = useState([]);

  useEffect(() => {
    onCheckedItemsChange(checkedItems);
  }, [checkedItems]);

  const handleToggleCheckbox = (item) => {
    const isChecked = checkedItems.includes(item);
    if (isChecked) {
      setCheckedItems(checkedItems.filter((v) => v !== item));
    } else {
      setCheckedItems([...checkedItems, item]);
    }
    onCheckedItemsChange(checkedItems);
  };

  const renderCheckboxes = () => {
    const itemsPerRow = 2;
    const numRows = Math.ceil(data.length / itemsPerRow);
    const rows = [];

    for (let i = 0; i < numRows; i++) {
      const startIndex = i * itemsPerRow;
      const endIndex = Math.min(startIndex + itemsPerRow, data.length);
      const rowData = data.slice(startIndex, endIndex);

      rows.push(
        <View key={i} style={{ flexDirection: 'row' }}>
          {rowData.map((item) => (
            <View key={item.id} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox
                outlineStyle={{borderColor: onError ? Colors.MAIN_RED : Colors.ABM_DARK_BLUE}}
                fillStyle={{backgroundColor: onError ? Colors.MAIN_RED : Colors.ABM_DARK_BLUE}}
                value={checkedItems.includes(item)}
                onToggle={() => {
                    onTrigger()
                    handleToggleCheckbox(item)
                }}
                text={item.name}
              />
            </View>
          ))}
        </View>
      );
    }

    return rows;
  };

  return <View>{renderCheckboxes()}</View>;
};

export default CheckBoxComponent;
