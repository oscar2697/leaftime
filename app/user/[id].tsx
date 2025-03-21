import { useLocalSearchParams, useRouter } from 'expo-router'
import { View, Text, TouchableOpacity, ScrollView, Pressable, FlatList, Modal } from 'react-native'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel';
import Loader from '@/components/Loader';
import { styles } from '@/styles/profile.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { useState } from 'react';
import { Doc } from '@/convex/_generated/dataModel'
import Posts from '@/components/Posts';
import { Image } from 'expo-image';

const UserProfileScrenn = () => {
    const { id } = useLocalSearchParams()
    const router = useRouter()
    const [selectedPost, setSelectedPost] = useState<Doc<'posts'> | null>(null)

    const profile = useQuery(api.users.getUserProfile, { userId: id as Id<"users"> })
    const posts = useQuery(api.posts.getPostByUser, { userId: id as Id<"users"> })
    const isFollowing = useQuery(api.users.isFollowing, { following: id as Id<"users"> })

    const postsWithAuthor = posts?.map(post => ({
        ...post,
        isLiked: false, 
        isBookmarked: false, 
        author: {
            _id: profile?._id || '',
            username: profile?.username || '',
            image: profile?.image || ''
        }
    }))

    const toggleFollow = useMutation(api.users.toggleFollow)

    const handleBack = () => {
        if (router.canGoBack()) router.back()
        else router.replace('/(tabs)')
    }

    if (profile === undefined || posts === undefined || isFollowing === undefined) return <Loader />

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack}>
                    <Ionicons name='arrow-back' size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{profile.username}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.profileInfo}>
                    <View style={styles.avatarAndStats}>
                        <Image
                            source={profile.image}
                            style={styles.avatar}
                            contentFit='cover'
                            cachePolicy='memory-disk'
                        />

                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{profile.posts}</Text>
                                <Text style={styles.statLabel}>Posts</Text>
                            </View>

                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{profile.followers}</Text>
                                <Text style={styles.statLabel}>Followers</Text>
                            </View>

                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{profile.following}</Text>
                                <Text style={styles.statLabel}>Following</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.name}>{profile.fullname}</Text>

                    {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

                    <Pressable
                        style={[styles.followButton, isFollowing && styles.followingButton]}
                        onPress={() => toggleFollow({ followingId: id as Id<'users'> })}
                    >
                        <Text
                            style={[styles.followButtonText, isFollowing && styles.followingButtonText]}
                        >
                            {isFollowing ? 'Following' : 'Follow'}
                        </Text>
                    </Pressable>
                </View>

                <View style={styles.postsGrid}>
                    {postsWithAuthor?.length === 0 ? (
                        <View style={styles.noPostsContainer}>
                            <Ionicons name='images-outline' size={48} color={COLORS.grey} />
                            <Text style={styles.noPostsText}>No posts yet</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={postsWithAuthor}
                            numColumns={3}
                            scrollEnabled={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.gridItem} onPress={() => setSelectedPost(item)}>
                                    <Image 
                                        source={item.imageUrl}
                                        style={styles.gridImage}
                                        contentFit='cover'
                                        cachePolicy='memory-disk'
                                        transition={200}
                                    />
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item._id}
                        />
                    )}
                </View>

                <Modal
                    visible={!!selectedPost}
                    animationType='fade'
                    transparent={true}
                    onRequestClose={() => setSelectedPost(null)}
                >
                    <View style={styles.modalBackdrop}>
                        {selectedPost && (
                            <View style={styles.postDetailContainer}>
                                <View style={styles.postDetailHeader}>
                                    <TouchableOpacity
                                        onPress={() => setSelectedPost(null)}
                                    >
                                        <Ionicons name='close' size={24} color={COLORS.white} />
                                    </TouchableOpacity>
                                </View>

                                <Posts 
                                    post={{
                                        ...selectedPost,
                                        isLiked: false, 
                                        isBookmarked: false, 
                                        author: {
                                            _id: profile?._id || '',
                                            username: profile?.username || '',
                                            image: profile?.image || ''
                                        }
                                    }} 
                                />
                            </View>
                        )}
                    </View>
                </Modal>
            </ScrollView>
        </View>
    )
}

export default UserProfileScrenn