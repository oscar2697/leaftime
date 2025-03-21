import { COLORS } from '@/constants/theme'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { styles } from '@/styles/feed.styles'
import { Ionicons } from '@expo/vector-icons'
import { useMutation, useQuery } from 'convex/react'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { useState } from 'react'
import { View, TouchableOpacity, Text, } from 'react-native'
import CommentsModal from './CommentsModal'
import { formatDistanceToNow } from 'date-fns'
import { useUser } from '@clerk/clerk-expo'

type PostProps = {
    post: {
        _id: Id<'posts'>
        imageUrl: string
        caption?: string
        likes: number
        comments: number
        _creationTime: number
        isLiked: boolean
        isBookmarked: boolean
        author: {
            _id: string
            username: string
            image: string
        }
    }
}

const Posts = ({ post }: PostProps) => {
    const [isLiked, setIsLiked] = useState(post.isLiked)
    const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked)
    const [showComments, setShowComments] = useState(false)
    const { user } = useUser()

    const currentUser = useQuery(api.users.getUserByClerkId, user ? { clerkId: user.id } : 'skip')

    const toogleLike = useMutation(api.posts.toggleLike)
    const toggleBookmark = useMutation(api.bookmarks.toggleBookmark)
    const deletePost = useMutation(api.posts.deletePost)

    const handleLike = async () => {
        try {
            const newLiked = await toogleLike({ postId: post._id })
            setIsLiked(newLiked)
        } catch (error) {
            console.log(error)
        }
    }

    const handleDelete = async () => {
        try {
            await deletePost({ postId: post._id })
        } catch (error) {
            console.log(error)
        }
    }

    const handleBookmark = async () => {
        const newBookmarked = await toggleBookmark({ postId: post._id })
        setIsBookmarked(newBookmarked)
    }

    return (
        <View style={styles.post}>
            <View style={styles.postHeader}>
                <Link href={currentUser?._id === post.author._id ? '/(tabs)/profile' : { pathname: "/user/[id]", params: { id: post.author._id }}} asChild>
                    <TouchableOpacity style={styles.postHeaderLeft}>
                        <Image
                            source={post.author.image}
                            style={styles.postAvatar}
                            contentFit='cover'
                            transition={200}
                            cachePolicy='memory-disk'
                        />

                        <Text style={styles.postUsername}>
                            {post.author.username}
                        </Text>
                    </TouchableOpacity>
                </Link>

                {post.author._id === currentUser?._id ? (
                    <TouchableOpacity onPress={handleDelete}>
                        <Ionicons name='trash-outline' size={20} color={COLORS.primary} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity>
                        <Ionicons name='ellipsis-horizontal' size={20} color={COLORS.white} />
                    </TouchableOpacity>
                )}
            </View>

            <Image
                source={post.imageUrl}
                style={styles.postImage}
                contentFit='cover'
                transition={200}
                cachePolicy='memory-disk'
            />

            <View style={styles.postActions}>
                <View style={styles.postActionsLeft}>
                    <TouchableOpacity onPress={handleLike}>
                        <Ionicons
                            name={
                                isLiked ? 'heart' : 'heart-outline'
                            }
                            size={24}
                            color={isLiked ? COLORS.primary : COLORS.white}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setShowComments(true)}>
                        <Ionicons name='chatbubble-outline' size={24} color={COLORS.white} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={handleBookmark}>
                    <Ionicons
                        name={
                            isBookmarked ? 'bookmark' : 'bookmark-outline'
                        }
                        size={24}
                        color={COLORS.white}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.postInfo}>
                <Text style={styles.likesText}>
                    {post.likes > 0 ? `${post.likes.toLocaleString()} likes` : 'Be the first to like this'}
                </Text>

                {post.caption && (
                    <View style={styles.captionContainer}>
                        <Text style={styles.captionUsername}>{post.author.username}</Text>
                        <Text style={styles.captionText}>{post.caption}</Text>
                    </View>
                )}

                {post.comments > 0 && (
                    <TouchableOpacity onPress={() => setShowComments(true)}>
                        <Text style={styles.commentText}>View all {post.comments} comments</Text>
                    </TouchableOpacity>
                )}

                <Text style={styles.timeAgo}>
                    {formatDistanceToNow(post._creationTime, { addSuffix: true })}
                </Text>
            </View>

            <CommentsModal
                postId={post._id}
                visible={showComments}
                onClose={() => setShowComments(false)}
            />
        </View>
    )
}

export default Posts