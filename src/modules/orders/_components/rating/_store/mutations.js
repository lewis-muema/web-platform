

export default {
    mutations: {
        updateScore (state, val){
            state.score = val;
        },
        updateBaseUrl (state, val){
            state.base_url = val;
        },
        updatePackageID(state,val){
            state.package_id = val;
        },
        updateRiderImage(state,val){
            state.rider_image = val;
        },
        updateDriverBaseImage(state,val){
            state.driver_image_base = val;
        },
        updateUserEmail(state,val){
            state.user_email = val;
        },
        updateStep(state,val){
            state.step = val;
        },
        updateDriverName(state,val){
            state.driver_name = val;
        },
        updateImagesBaseUrl(state,val){
            state.images_base_url = val;
        },
        updatePostRatingComponent(state,val){
            state.post_rating_component = val;
        }

    },
};
