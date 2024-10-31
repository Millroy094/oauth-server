# OAuth Service
This is an end to end oauth server with an Express.js backend and a React.js front-end using node-oidc-provider to create a OpenId connect auth service. It uses DynamoDb for storage and apart from being just for OpenID connect it also has admin to manage different users and clients.

It houses itself on AWS EKS using Helm and kubernetes deployed using a combination of GitHub Actions, Terraform, Helm, Kubectl. Solidified by running unit tests during the build (ci) process and proof checked again by running Playwright e2e tests after running the deployment process (CD). As mentioned consists of two stages:

1. The build stage which is CI that builds the docker image artificate.
2. The deploy stage where the artefact in the previous stage is picked up and deployed in the CD. 
