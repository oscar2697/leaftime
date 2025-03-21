import { FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/feed.styles";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Loader from "@/components/Loader";
import Posts from "@/components/Posts";
import StoriesSection from "@/components/Stories";
import { useState } from "react";

export default function Index() {
  const { signOut } = useAuth()
  const [refresh, setRefresh] = useState(false)
  const posts = useQuery(api.posts.getFeedPosts)

  if (posts === undefined) return <Loader />
  if (posts.length === 0) return <NoPostsFound />

  const handleRefresh = () => {
    setRefresh(true)

    setTimeout(() => {
      setRefresh(false)
    }, 2000)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>leaftime</Text>

        <TouchableOpacity onPress={() => signOut()}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <Posts
            key={item._id}
            post={item}
          />
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={StoriesSection}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
          />
        }
      />
    </View>
  );
}

const NoPostsFound = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: COLORS.background,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text
      style={{
        fontSize: 20,
        color: COLORS.primary,
      }}
    >
      No posts found
    </Text>
  </View>
)