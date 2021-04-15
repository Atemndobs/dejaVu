export default {
  user: null,
  loginCallbacks: [],
  userData: (data) => {
    return {
      id: data.id,
      email: data.attributes? data.attributes.email:data.email,
      name: data.attributes? data.attributes.name : data.name,
      username: data.attributes? data.attributes.username : data.username,
      tagline: data.attributes? data.attributes.tagline : data.tagline,
      about: data.attributes? data.attributes.about : data.about,
      location: data.attributes? data.attributes.location : data.location,
      photo_url: data.attributes? data.attributes.photo_url : data.photo_url,
      followers: data.attributes? data.attributes.followers : data.followers,
      follower_count: data.attributes? data.attributes.follower_count : data.follower_count,
      formatted_address: data.attributes? data.attributes.formatted_address : data.formatted_address,
    }
  }
}
