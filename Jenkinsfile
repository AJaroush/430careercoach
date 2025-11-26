pipeline {
    agent any

    triggers {
        githubPush()  // automatically runs when GitHub updates
    }

    stages {
        stage('Build') {
            steps {
                echo "Building application..."
                # put your build steps here
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying application..."
                # put deployment commands here
            }
        }
    }
}
