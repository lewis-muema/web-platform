pipeline {
    agent any
    parameters {
        string(name: 'ENV_TAG', defaultValue: '')
    }
    environment {

           APP_NAME = "vue_web_platform"
           MAVEN_CLI_OPTS = "-e -s .m2/settings.xml --batch-mode -U dependency:resolve"
           IMAGE_BASE_NAME = "${CI_REGISTRY}/${APP_NAME}"

    }

    stages {
        stage('eslint') {
            agent {
            any {
                image 'node:14.18.1'
            }
            }
            steps {
                  script {                  
                        sh '''
                            npm i eslint
                            npm run lint
'                      '''
                  }                 
            }            
        }

        stage('Test') {
            agent {
            any {
                image 'node:14.18.1'
            }
            }
            steps {
               sh '''
                    npm i mocha-webpack
                    npm run test
               '''

            }
        }

        stage('Docker Build & Push Image') {
            steps {
              script {
                
                if(env.BRANCH_NAME == "master") {
                          env.ENV_TAG = "prod"
                    } else {
                          env.ENV_TAG = "dev"
                }

                sh '''
                    IMAGE_TAG="$ENV_TAG_$(date +%Y-%m-%d-%H-%M)"
                    IMAGE_NAME="${IMAGE_BASE_NAME}:${IMAGE_TAG}"
                    docker build -f Dockerfile -t $IMAGE_NAME .
                    docker push $IMAGE_NAME
                '''
              }
            }
        }
    }
}