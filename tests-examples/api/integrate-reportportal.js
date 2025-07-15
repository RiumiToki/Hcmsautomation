const fs = require('fs');
const newman = require("newman");
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

newman.run(
  {
    collection: "./tests/api/collection/Fillamen.postman_collection.json",
    environment: './tests/api/env/Fillamen_Prod.postman_environment.json',
    reporters: "@reportportal/agent-js-postman",
    reporter: {
      "@reportportal/agent-js-postman": {
        apiKey: `${process.env.TOKEN_REPORTPORTAL}`,
        endpoint: `${process.env.URL_REPORTPORTAL}`,
        project: `${process.env.PROJECT_REPORTPORTAL}`,
        launch: 'API Test - Automation',
        attributes: [
          {
            key: 'environment',
            value: `${process.env.ENVIRONMENT}`,
          },
          {
            key: "execution_type",
            value: "automated",
          }
        ],
        mode: "DEFAULT",
        debug: false
      }
    }
  },
  function(err) {
    if (err) {
      throw err;
    }
    console.log("collection run complete!");
  }
);

fs.readdir("./tests/api/collection", (err, files) => {
  if (err) {
    throw err;
  }
  files.forEach((file) => {
    // setup newman.run()
  });
});