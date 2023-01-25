import { Text } from "react-native";
import React, { memo } from "react";

interface FriendProps {
  data: {
    id: number;
    name: string;
    likes: number;
  };
}

function FriendComponent({ data: { likes, name } }: FriendProps) {
  return (
    <Text>
      {name} - Likes {likes}
    </Text>
  );
}

export const Friend = memo(FriendComponent, (prevProps, nextProps) => {
  return Object.is(prevProps.data, nextProps.data);
});
