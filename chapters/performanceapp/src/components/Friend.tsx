import { Text, View, TouchableOpacity } from "react-native";
import React, { memo } from "react";

interface FriendProps {
  data: {
    id: number;
    name: string;
    likes: number;
  };
  unFollow: () => void;
}

function FriendComponent({ data: { likes, name }, unFollow }: FriendProps) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text>
        {name} - Likes {likes}
      </Text>
      <TouchableOpacity onPress={unFollow}>
        <Text>Deixar de seguir</Text>
      </TouchableOpacity>
    </View>
  );
}

export const Friend = memo(FriendComponent, (prevProps, nextProps) => {
  return Object.is(prevProps.data, nextProps.data);
});
