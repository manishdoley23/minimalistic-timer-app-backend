const generateAccessAndRefreshTokens = async (userId) => {
	try {
		const user = await User.findById(userId);

		const accessToken = user.generateAccessToken();
		const refreshToken = user.generateRefreshToken();

		// attach refresh token to the user document to avoid refreshing the access token with multiple refresh tokens
		user.refreshToken = refreshToken;

		await user.save({ validateBeforeSave: false });
		return { accessToken, refreshToken };
	} catch (error) {
		throw new ApiError(
			500,
			"Something went wrong while generating the access token"
		);
	}
};
