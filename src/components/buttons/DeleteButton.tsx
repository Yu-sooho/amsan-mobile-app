import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {IconTrash} from '../icons';
import {sizeConverter} from '../../utils';

type DeleteButtonProps = {
  onPress: () => void;
};

const DeleteButton: React.FC<DeleteButtonProps> = ({onPress}) => {
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      height: sizeConverter(44),
      justifyContent: 'center',
      paddingRight: sizeConverter(8),
      width: sizeConverter(44),
    },
  });

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <IconTrash size={sizeConverter(24)} />
    </TouchableOpacity>
  );
};

export default DeleteButton;
