export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTE = "api/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTE}/signup`
export const LOGIN_ROUTE = `${AUTH_ROUTE}/login`
export const GET_USER_INFO = `${AUTH_ROUTE}/user-info`
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTE}/update-profile`
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTE}/add-profile-image`
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTE}/remove-profile-image`
export const LOGOUT_ROUTE = `${AUTH_ROUTE}/logout`

export const CONTACT_ROUTE = "api/contacts";
export const SEARCH_CONTACT_ROUTE = `${CONTACT_ROUTE}/search`
export const GET_CONTACT_FOR_DM_ROUTE = `${CONTACT_ROUTE}/get-contact-for-dm`
export const GET_ALL_CONTACTS_ROUTE = `${CONTACT_ROUTE}/get-all-contacts`


export const MESSAGE_ROUTE = "api/messages";
export const GET_ALL_MESSAGES_ROUTE = `${MESSAGE_ROUTE}/get-messages`
export const UPLOAD_FILE_ROUTE = `${MESSAGE_ROUTE}/upload-file`


export const CHANNEL_ROUTE = "api/channel";
export const CREATE_CHANNEL_ROUTE = `${CHANNEL_ROUTE}/create-channel`
export const GET_ALL_CHANNEL_ROUTE = `${CHANNEL_ROUTE}/get-all-channels`
export const GET_CHANNEL_MESSAGES_ROUTE = `${CHANNEL_ROUTE}/get-channel-messages`