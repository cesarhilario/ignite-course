import React, { useMemo } from "react";
import { View, Text, FlatList } from "react-native";
import { Friend } from "./Friend";

interface FriendListProps {
  data: {
    id: string;
    name: string;
    likes: number;
    online: string;
  }[];
  unFollow: () => void;
}

export function FriendList({ data, unFollow }: FriendListProps) {
  const totalLikes = useMemo(() => {
    return data.reduce((likes, friend) => {
      return likes + friend.likes;
    }, 0);
  }, [data]);

  return (
    <View>
      <Text>Total de Likes: {totalLikes}</Text>
      {/* {data.map((friend) => (
        <Friend unFollow={unFollow} key={friend.id} data={friend} />
      ))} */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item: friend }) => (
          <Friend unFollow={unFollow} key={friend.id} data={friend} />
        )}
      />
    </View>
  );
}
