
module.exports = {

	port: process.env.PORT || 80,

	auth: {
		apiKeyId: process.env.STORMPATH_CLIENT_APIKEY_ID,
		apiKeySecret: process.env.STORMPATH_CLIENT_APIKEY_SECRET,
		application: process.env.STORMPATH_APPLICATION_HREF
	}
};
