import { imageUtils } from "@/shared/utils/image.utils";
import { HomepageStory } from "../story.types";
import StoryRating from "./story-rating";

interface StoryGridProps {
  stories: HomepageStory[];
}

export default function StoryGrid({ stories }: StoryGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {stories.map((story) => (
        <div key={story.id} className="mb-7.5 flex items-start gap-2">
          <img
            src={
              story.coverImage
                ? imageUtils.optimizeCloudinary(story.coverImage, {
                    width: 110,
                    height: 150,
                  })
                : ""
            }
            alt={`CoverImage_${story.id}`}
            className="shrink-0 object-cover"
            style={{ width: 110, height: 150 }}
          />

          <div className="space-y-2 flex-1 min-w-0">
            <h3 className="font-medium uppercase line-clamp-2">
              {story.title}
            </h3>{" "}
            <StoryRating story={story} />
          </div>
        </div>
      ))}
    </div>
  );
}
