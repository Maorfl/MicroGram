export  interface ReelMetaInfoType {
    videoDimensions?: {
        height?: number; // height of the each reel container
        width?: number; // width of the each reel container
    },
    backGroundColor?: string; // background colour for desktop view
    borderRadius?: number; // border radius of each reel container
    likeActiveColor?: string; // like icon colour when clicked
    dislikeActiveColor?: string; // dislike icon color when clicked
}