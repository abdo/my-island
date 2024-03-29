import * as actionTypes from "./actionTypes";
import * as internetActions from "./internetActions";

export * from "./basicActions";

export * from "./internetActions";

export * from "./authenticationActions";

export * from "./saveAndFetchActions";

export const requestEverythingFromInternet = () => {
  return dispatch => {
    dispatch(
      internetActions.requestUserLocationInfoAndRequestUserWeatherInfo()
    );
    dispatch(internetActions.requestSeriousNews());
    dispatch(internetActions.requestSillyNews());
    //dispatch(internetActions.requestQuote());  -> api not working because of cors issue
    dispatch(internetActions.requestComic());

    dispatch(internetActions.requestLatestNews("general"));
    //dispatch(internetActions.requestLatestNews("sports"));
    //dispatch(internetActions.requestLatestNews("technology"));
    //dispatch(internetActions.requestLatestNews("nature"));

    dispatch(
      internetActions.requestUserLocationInfoAndRequestMyCountryNews("general")
    );
    // dispatch(
    //   internetActions.requestUserLocationInfoAndRequestMyCountryNews("sports")
    // );
    // dispatch(
    //   internetActions.requestUserLocationInfoAndRequestMyCountryNews(
    //     "technology"
    //   )
    // );
    // dispatch(
    //   internetActions.requestUserLocationInfoAndRequestMyCountryNews("business")
    // );

    dispatch(incrementMassiveRequestsCount());
  };
};

const incrementMassiveRequestsCount = () => {
  return {
    type: actionTypes.INCREMENT_MASSIVE_REQUESTS_COUNT
  };
};
