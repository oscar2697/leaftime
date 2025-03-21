import { styles } from '@/styles/feed.styles'
import { View, Text, Image } from 'react-native'
import { formatDistanceToNow } from 'date-fns'

interface Comments {
    content: string
    _creationTime: number
    user: {
        fullname: string
        image: string
    }
}

const Comment = ({ comment }: { comment: Comments }) => {
    return (
        <View style={styles.commentContainer}>
            <Image
                source={{ uri: comment.user.image }}
                style={styles.commentAvatar}
            />

            <View style={styles.commentContent}>
                <Text style={styles.commentUsername}>{comment.user.fullname}</Text>
                <Text style={styles.commentsText}>{comment.content}</Text>

                <Text style={styles.commentTime}>
                    {formatDistanceToNow(comment._creationTime, { addSuffix: true })}
                </Text>
            </View>
        </View>
    )
}

export default Comment