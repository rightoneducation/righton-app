const { ApiClient, Environment } = require("@righton/networking")

global.apiClient = new ApiClient(Environment.Developing)