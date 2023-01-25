import React from "react";
import { View } from "react-native";
import { Friend } from "./Friend";

interface FriendListProps {
  data: {
    id: number;
    name: string;
    likes: number;
  }[];
}

export function FriendList({ data }: FriendListProps) {
  return (
    <View>
      {data.map((friend) => (
        <Friend key={friend.id} data={friend} />
      ))}
    </View>
  );
}
