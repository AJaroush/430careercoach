pipeline {
    agent any

    triggers {
        githubPush()
    }

    stages {
        stage('Install dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Build React app') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy locally') {
            steps {
                sh '''
                # kill any previously running server
                pkill -f "serve" || true

                # install static server if not installed
                npm install -g serve

                # run the build in background
                nohup serve -s frontend/build -l 3000 &
                '''
            }
        }
    }
}
