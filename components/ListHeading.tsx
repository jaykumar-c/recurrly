import { Text, TouchableOpacity, View } from "react-native";

const ListHeading = ({ title, onViewAllPress }: ListHeadingProps) => {
  return (
    <View className="list-head">
      <Text className="list-title">{title}</Text>

      <TouchableOpacity
        className="list-action"
        onPress={onViewAllPress}
        activeOpacity={0.7}
      >
        <Text className="list-action-text">View all</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ListHeading;
