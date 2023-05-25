pipeline {

    agent any
    parameters {
        string(name: 'ENV_TAG', defaultValue: 'dev')
    }

    environment {
           npm_config_cache = 'npm-cache'
           APP_NAME = "vue_web_platform"
           IMAGE_BASE_NAME = "${CI_REGISTRY}/${APP_NAME}"
    }

    stages {
        // stage('eslint') {
        //     agent { docker { image 'node:14.18.1' } }
        //     steps {
        //         sh '''
        //             node --version
        //             npm i eslint
        //             npm run lint
        //         '''
        //     }
        // }

        // stage('Test') {
        //     agent { docker { image 'node:14.18.1' } }
        //     steps {
        //        sh '''
        //             npm i mocha-webpack
        //             npm run test
        //        '''

        //     }
        // }

        stage('Webpack Build') {
    steps {
        script {
            sh '''
                # Set the desired environment variables
                if [ "${env.BRANCH_NAME}" == "master" ]; then
                    export NODE_ENV="prod"
                elif [ "${env.BRANCH_NAME}" == "pre-prod" ]; then
                    export NODE_ENV="pre-prod"
                else
                    export NODE_ENV="dev"
                fi

                export DOCKER_ENV=$NODE_ENV

                # Build the webpack bundle
                cross-env NODE_ENV=$NODE_ENV webpack --config build/webpack.client.config.js --progress --hide-modules
            '''
        }
      }
    }

  stage('Docker Build & Push Image') {
      steps {
          script {
              sh '''
                  # Set the desired environment variables
                  if [ "${env.BRANCH_NAME}" == "master" ]; then
                      export NODE_ENV="prod"
                  elif [ "${env.BRANCH_NAME}" == "pre-prod" ]; then
                      export NODE_ENV="pre-prod"
                  else
                      export NODE_ENV="dev"
                  fi

                  export DOCKER_ENV=$NODE_ENV

                  # Build and push the Docker image
                  IMAGE_TAG="${NODE_ENV}_$(date +%Y-%m-%d-%H-%M)"
                  IMAGE_NAME="${IMAGE_BASE_NAME}:${IMAGE_TAG}"
                  docker build -f Dockerfile -t $IMAGE_NAME .
                  docker push $IMAGE_NAME
              '''
          }
        }
      }

    }
}
