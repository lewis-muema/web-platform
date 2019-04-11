const getScore = state => state.score;
const getViewState = state => state.view_state;
const getBaseUrl = state => state.base_url;
const getPackageID = state => state.package_id;
const getRiderImage = state => state.rider_image;
const getDriverBaseImage = state => state.driver_image_base;
const getUserEmail = state => state.user_email;
const getStep = state => state.step;
const getDriverName = state => state.driver_name;
const getImagesBaseUrl = state => state.images_base_url;
const getPostRatingComponent = state => state.post_rating_component;
const getPostRatingComponentBusiness = state => state.post_rating_component_business;
export default {
  getScore,
  getPackageID,
  getBaseUrl,
  getViewState,
  getRiderImage,
  getDriverBaseImage,
  getUserEmail,
  getStep,
  getDriverName,
  getImagesBaseUrl,
  getPostRatingComponent,
  getPostRatingComponentBusiness,
};
