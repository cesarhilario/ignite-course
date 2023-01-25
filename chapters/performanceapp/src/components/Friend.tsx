import { Text, View, TouchableOpacity } from "react-native";
import React, { memo } from "react";

interface FriendProps {
  data: {
    id: string;
    name: string;
    likes: number;
    online: string;
  };
  unFollow: () => void;
}

function FriendComponent({
  data: { likes, name, online },
  unFollow,
}: FriendProps) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text>
        {name} - Likes {likes}
      </Text>
      <TouchableOpacity onPress={unFollow}>
        <Text>Deixar de seguir</Text>
      </TouchableOpacity>
      <Text>
        Online em: {online}
        {/* // ! DON'T DO THIS (calculations here`)*/}
        {/* {new Date().getHours()}:{new Date().getMinutes()} */}
      </Text>
    </View>
  );
}

export const Friend = memo(FriendComponent, (prevProps, nextProps) => {
  return Object.is(prevProps.data, nextProps.data);
});
