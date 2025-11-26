pipeline {
    agent any

    triggers {
        githubPush()
    }

    stages {
        stage('Build') {
            steps {
                echo "Building application..."
                // build commands go here
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying application..."
                // deploy commands go here
            }
        }
    }
}
