pipeline {
    agent any
    environment {
        VERSION = sh(script: "jq -r '.version' package.json", returnStdout: true).trim()
        AWS_BUCKET_REGION = 'eu-west-1'
    }
    options {
        buildDiscarder(logRotator(numToKeepStr: '3'))
        timeout(time: 1, unit: 'HOURS')
        disableConcurrentBuilds()
    }

    stages {
        stage('Build version') {
            environment {
               // This will automatically set the public assets path in a create-react-app - meaning all assets defined in index.html will be fetched from s3 (static)
               PUBLIC_URL = "https://static.paymentiq.io/bo2/$VERSION"
            }
            steps {
                script {
                    switch(BRANCH_NAME) {
                        case "main":
                        default:
                            sh "docker build -f Dockerfile -t piq/bo2 ."
                            sh "docker run --name paymentiq-backoffice-2-monorepo --rm -t piq/bo2 sh"
                            sh "cd /bambora/workspaces/frontend"
                            sh "yarn build"
                            break;
                        // default:
                        //     return
                    }
                }
            }
        }

        stage('Deploy version') {
            steps {
                script {
                    VERSION = sh(script: "jq -r '.version' package.json", returnStdout: true).trim()
                    withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'd729498a-1f0a-4de4-a700-2b93d5cf689e', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                        switch(BRANCH_NAME) {
                            case "main":
                                // sync everything in /build to static, exclude index.html, we wanna do a hard copy to avoid cache
                                sh "aws s3 sync ./build  s3://static.paymentiq.io/bo2/$VERSION --exclude index.html --exclude service-worker.js --region eu-west-1 --only-show-errors --acl bucket-owner-full-control --acl public-read --cache-control max-age=31536000"
                                
                                // copy service-worker.js
                                sh "aws s3 cp ./build/service-worker.js  s3://static.paymentiq.io/bo2/$VERSION/service-worker.js --region eu-west-1 --only-show-errors --acl bucket-owner-full-control --acl public-read --cache-control max-age=0,no-cache,no-store,must-revalidate"
                                
                                // copy index.html, which contains all the new file hash-names to get the new stuff
                                sh "aws s3 cp ./build/index.html  s3://backoffice.paymentiq.io/bo2/$VERSION/index.html --region eu-west-1 --only-show-errors --acl bucket-owner-full-control --acl public-read --cache-control max-age=0,no-cache,no-store,must-revalidate"
                            break;
                            default:
                            // sh "docker build -f Dockerfile -t piq/piq-backoffice-v2 ."
                               sh "pwd"
                            break;
                        }
                    }
                }
            }
        }
    }
}
