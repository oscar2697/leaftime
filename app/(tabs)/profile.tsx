import { api } from '@/convex/_generated/api'
import { Doc } from '@/convex/_generated/dataModel'
import { useAuth } from '@clerk/clerk-expo'
import { useMutation, useQuery } from 'convex/react'
import { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, FlatList, Modal, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, TextInput } from 'react-native'
import Loader from '@/components/Loader'
import { styles } from '@/styles/profile.styles'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/theme'
import { Image } from 'expo-image'
import Posts from '@/components/Posts'

const Profile = () => {
    const { signOut, userId } = useAuth()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : 'skip')

    const [isEditedProfile, setIsEditedProfile] = useState({
        fullname: currentUser?.fullname || '',
        bio: currentUser?.bio || '',
    })

    const [selectedPost, setSelectedPost] = useState<Doc<'posts'> | null>(null)
    const posts = useQuery(api.posts.getPostByUser, currentUser?._id ? { userId: currentUser._id } : 'skip')

    const postsWithAuthor = posts?.map(post => ({
        ...post,
        isLiked: false,
        isBookmarked: false,
        author: {
            _id: currentUser?._id || '',
            username: currentUser?.username || '',
            image: currentUser?.image || ''
        }
    }))

    const updateProfile = useMutation(api.users.updateProfile)

    const handleSaveProfile = async () => {
        await updateProfile(isEditedProfile)
        setIsModalVisible(false)
    }

    if (!currentUser || posts === undefined) return <Loader />

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.username}>{currentUser?.username}</Text>
                </View>

                <View style={styles.headerRight}>
                    <TouchableOpacity
                        style={styles.headerIcon}
                        onPress={() => signOut()}
                    >
                        <Ionicons name='log-out-outline' size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.profileInfo}>
                    <View style={styles.avatarAndStats}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={currentUser.image}
                                style={styles.avatar}
                                contentFit='cover'
                                transition={200}
                            />
                        </View>

                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{currentUser.posts}</Text>
                                <Text style={styles.statLabel}>Posts</Text>
                            </View>

                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{currentUser.followers}</Text>
                                <Text style={styles.statLabel}>Followers</Text>
                            </View>

                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{currentUser.following}</Text>
                                <Text style={styles.statLabel}>Following</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.name}>{currentUser.fullname}</Text>

                    {currentUser.bio && (
                        <Text style={styles.bio}>{currentUser.bio}</Text>
                    )}

                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.editButton} onPress={() => setIsModalVisible(true)}>
                            <Text style={styles.editButtonText}>Edit Profile</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.shareButton}>
                            <Ionicons name='share-outline' size={24} color={COLORS.white} />
                        </TouchableOpacity>
                    </View>
                </View>

                {posts.length === 0 && <NotFound />}

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
                                transition={200}
                            />
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item._id}
                />
            </ScrollView>

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
                                        _id: currentUser?._id || '',
                                        username: currentUser?.username || '',
                                        image: currentUser?.image || ''
                                    }
                                }} 
                            />
                        </View>
                    )}
                </View>
            </Modal>

            <Modal
                visible={isModalVisible}
                animationType='slide'
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.modalContainer}
                    >
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Edit Profile</Text>

                                <TouchableOpacity
                                    onPress={() => setIsModalVisible(false)}
                                >
                                    <Ionicons name='close' size={24} color={COLORS.white} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Name</Text>

                                <TextInput
                                    style={styles.input}
                                    value={isEditedProfile.fullname}
                                    onChangeText={(text) => setIsEditedProfile((prev) => ({ ...prev, fullname: text }))}
                                    placeholder='Enter your name'
                                    placeholderTextColor={COLORS.grey}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Bio</Text>

                                <TextInput
                                    style={[styles.input, styles.bioInput]}
                                    value={isEditedProfile.bio}
                                    onChangeText={(text) => setIsEditedProfile((prev) => ({ ...prev, bio: text }))}
                                    multiline
                                    numberOfLines={5}
                                    placeholder='Enter your bio'
                                    placeholderTextColor={COLORS.grey}
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSaveProfile}
                            >
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    )
}

function NotFound() {
    return (
        <View
            style={{
                height: '100%',
                backgroundColor: COLORS.background,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Ionicons name='images-outline' size={48} color={COLORS.primary} />
            <Text style={{ fontSize: 20, color: COLORS.white }}>No posts found</Text>
        </View>
    )
}

export default Profile