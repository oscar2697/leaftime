import { ScrollView } from "react-native"
import { STORIES } from "@/constants/mock-data";
import { styles } from "@/styles/feed.styles";
import Story from "@/components/Story";

const StoriesSection = () => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.storiesContainer}
        >
            {STORIES.map((story) => (
                <Story
                    key={story.id}
                    story={story}
                />
            ))}
        </ScrollView>
    )
}

export default StoriesSection